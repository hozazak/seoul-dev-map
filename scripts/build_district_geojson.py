#!/usr/bin/env python3
"""
지구단위계획구역 + 특별계획구역 → GeoJSON 변환 및 HTML 삽입
"""
import json
from pathlib import Path
from datetime import datetime, timezone

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

# 자치구 코드 → 이름 매핑
SGG_MAP = {
    "11110": "종로구", "11140": "중구", "11170": "용산구", "11200": "성동구",
    "11215": "광진구", "11230": "동대문구", "11260": "중랑구", "11290": "성북구",
    "11305": "강북구", "11320": "도봉구", "11350": "노원구", "11380": "은평구",
    "11410": "서대문구", "11440": "마포구", "11470": "양천구", "11500": "강서구",
    "11530": "구로구", "11545": "금천구", "11560": "영등포구", "11590": "동작구",
    "11620": "관악구", "11650": "서초구", "11680": "강남구", "11710": "송파구",
    "11740": "강동구", "11000": "서울특별시",
}


def convert_layer(attrs_file, geom_file, layer_type):
    """ArcGIS JSON → GeoJSON FeatureCollection"""
    with open(DATA_DIR / attrs_file) as f:
        attrs_list = json.load(f)
    with open(DATA_DIR / geom_file) as f:
        geom_list = json.load(f)

    # PRESENT_SN 기반 조인
    geom_map = {}
    for g in geom_list:
        sn = g.get("attributes", {}).get("PRESENT_SN", "")
        rings = g.get("geometry", {}).get("rings", [])
        if sn and rings:
            geom_map[sn] = rings

    features = []
    for item in attrs_list:
        a = item.get("attributes", {})
        sn = a.get("PRESENT_SN", "")
        rings = geom_map.get(sn)
        if not rings:
            continue

        # ArcGIS rings → GeoJSON Polygon coordinates
        coords = [ring for ring in rings]

        # 날짜 변환
        create_ms = a.get("CREATE_DAT")
        date_str = ""
        if create_ms:
            dt = datetime.fromtimestamp(create_ms / 1000, tz=timezone.utc)
            date_str = dt.strftime("%Y-%m-%d")

        gu = SGG_MAP.get(a.get("SIGNGU_SE", ""), "")

        feature = {
            "type": "Feature",
            "properties": {
                "구역명": a.get("DGM_NM", "").strip(),
                "자치구": gu,
                "면적_m2": round(a.get("DGM_AR", 0), 1),
                "고시번호": a.get("NTFC_SN", "").strip(),
                "지정일": date_str,
                "유형": layer_type,
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": coords,
            }
        }
        features.append(feature)

    return features


def main():
    print("변환 시작...")

    district_features = convert_layer(
        "upis_district_plan_attrs.json", "upis_district_plan_geom.json",
        "지구단위계획구역"
    )
    special_features = convert_layer(
        "upis_special_plan_attrs.json", "upis_special_plan_geom.json",
        "특별계획구역"
    )

    print(f"지구단위계획구역: {len(district_features)}건")
    print(f"특별계획구역: {len(special_features)}건")

    # 합친 GeoJSON 저장
    combined = {
        "type": "FeatureCollection",
        "features": district_features + special_features
    }

    out_path = DATA_DIR.parent / "output" / "district_plan.geojson"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(combined, f, ensure_ascii=False)
    print(f"저장: {out_path} ({len(combined['features'])}건)")

    # JS 변수로 출력 (HTML 삽입용)
    js_path = DATA_DIR.parent / "output" / "district_plan_data.js"
    with open(js_path, "w", encoding="utf-8") as f:
        f.write(f"const DISTRICT_PLAN_DATA = {json.dumps(combined, ensure_ascii=False)};\n")
    print(f"JS 데이터: {js_path}")


if __name__ == "__main__":
    main()
