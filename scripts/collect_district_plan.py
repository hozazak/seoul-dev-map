#!/usr/bin/env python3
"""
UPIS 지구단위계획구역 + 특별계획구역 수집

WMS MapServer 레이어:
  33 = 지구단위계획구역 (UPIS_C_UQ161)  ~1,022건
  34 = 특별계획구역 (UPIS_C_UQ165)      ~896건

Playwright로 UPIS 프록시 세션 경유.
페이지네이션 미지원 → objectIds 배치 방식.
"""
import asyncio, json, sys
from pathlib import Path

PROXY = "https://urban.seoul.go.kr/proxy/proxy.jsp?"
WMS_BASE = "http://98.33.2.225:6080/arcgis/rest/services/UPIS/20200526_WMS/MapServer"
INIT_URL = "https://urban.seoul.go.kr/view/map/main.html?presentSn=11000UQ120PS202407010863&bsnsCd=BZ101"

LAYERS = {
    33: {"name": "지구단위계획구역", "type": "district_plan"},
    34: {"name": "특별계획구역", "type": "special_plan"},
}

OUT_DIR = Path(__file__).resolve().parent.parent / "data"
ATTR_FIELDS = "PRESENT_SN,DGM_NM,SIGNGU_SE,DGM_AR,DGM_LT,LCLAS_CL,MLSFC_CL,SCLAS_CL,NTFC_SN,CREATE_DAT"
BATCH = 500  # objectIds per request


async def fetch_layer(page, layer_id: int, info: dict):
    name = info["name"]
    print(f"\n📋 [{name}] 레이어 {layer_id} 수집 시작")

    # 1. 전체 objectIds 가져오기
    ids_url = (
        f"{PROXY}{WMS_BASE}/{layer_id}/query?f=json"
        "&where=1%3D1&returnIdsOnly=true"
    )
    ids_data = await page.evaluate("(u) => fetch(u).then(r=>r.json())", ids_url)
    all_ids = ids_data.get("objectIds", [])
    print(f"   총 건수: {len(all_ids)}")

    if not all_ids:
        return [], []

    # 2. 속성 수집 (objectIds 배치)
    attrs_all = []
    for i in range(0, len(all_ids), BATCH):
        batch_ids = all_ids[i:i+BATCH]
        ids_str = ",".join(str(x) for x in batch_ids)
        url = (
            f"{PROXY}{WMS_BASE}/{layer_id}/query?f=json"
            f"&objectIds={ids_str}&outFields={ATTR_FIELDS}"
            f"&returnGeometry=false"
        )
        data = await page.evaluate("(u) => fetch(u).then(r=>r.json())", url)
        features = data.get("features", [])
        attrs_all.extend(features)
        print(f"   속성: {len(attrs_all)}/{len(all_ids)}")
        await asyncio.sleep(0.3)

    print(f"   → 속성 {len(attrs_all)}건 완료")

    # 3. 폴리곤 수집 (objectIds 배치)
    geom_all = []
    for i in range(0, len(all_ids), BATCH):
        batch_ids = all_ids[i:i+BATCH]
        ids_str = ",".join(str(x) for x in batch_ids)
        url = (
            f"{PROXY}{WMS_BASE}/{layer_id}/query?f=json"
            f"&objectIds={ids_str}&outFields=PRESENT_SN"
            f"&returnGeometry=true&outSR=4326&geometryPrecision=5"
        )
        data = await page.evaluate("(u) => fetch(u).then(r=>r.json())", url)
        features = data.get("features", [])
        valid = [f for f in features if f.get("geometry", {}).get("rings")]
        geom_all.extend(valid)
        print(f"   폴리곤: {len(geom_all)} (batch {i//BATCH+1})")
        await asyncio.sleep(0.3)

    print(f"   → 폴리곤 {len(geom_all)}건 완료")
    return attrs_all, geom_all


async def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    try:
        from playwright.async_api import async_playwright
    except ImportError:
        print("❌ pip install playwright && playwright install chromium")
        sys.exit(1)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        print("🌐 세션 초기화...")
        await page.goto(INIT_URL, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(4)
        print("   세션 준비 완료")

        for layer_id, info in LAYERS.items():
            attrs, geoms = await fetch_layer(page, layer_id, info)

            tag = info["type"]
            attrs_path = OUT_DIR / f"upis_{tag}_attrs.json"
            geom_path = OUT_DIR / f"upis_{tag}_geom.json"

            with open(attrs_path, "w", encoding="utf-8") as f:
                json.dump(attrs, f, ensure_ascii=False)
            with open(geom_path, "w", encoding="utf-8") as f:
                json.dump(geoms, f, ensure_ascii=False)

            print(f"   💾 저장: {attrs_path.name} ({len(attrs)}건), {geom_path.name} ({len(geoms)}건)")

        await browser.close()

    print("\n✅ 수집 완료!")


if __name__ == "__main__":
    asyncio.run(main())
