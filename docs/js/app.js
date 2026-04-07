async function initApp() {
  const response = await fetch('./data/projects.json');
  const GEOJSON = await response.json();
const STAGE_GROUPS = {
  "계획/기획": { color: "#A8D8EA", codes: ["PP0101", "PP0102", "PP0103", "PP0201", "PP0202", "PP0301", "PP0302", "PP0401", "PP0402", "PP0802", "PP0803", "PP0801", "PP0804", "PP0901", "PP0902", "PP0903", "PP0904", "PP1101", "PP1102", "PP1103", "PP1201", "PP1202", "PP1301", "PP1302", "PP1601", "PP1602", "PP1801", "PP1802", "PP1803", "PP2001", "PP2002", "PP2201", "PP2202", "PP2203"] },
  "심의/인가": { color: "#FFD700", codes: ["PP0203", "PP0204", "PP0205", "PP0206", "PP0303", "PP0304", "PP0403", "PP0404", "PP0405", "PP0406", "PP0500", "PP0501", "PP0502", "PP0503", "PP0601", "PP0602", "PP0603", "PP0701", "PP0702", "PP0703", "PP0805", "PP0806", "PP0807", "PP0905", "PP0906", "PP0907", "PP1001", "PP1002", "PP1104", "PP1105", "PP1107", "PP1108", "PP1109", "PP1110", "PP1203", "PP1204", "PP1303", "PP1304", "PP1401", "PP1402", "PP1403", "PP1501", "PP1502", "PP1503", "PP1603", "PP1804", "PP1805", "PP1806", "PP2003", "PP2004", "PP2005", "PP2101", "PP2102", "PP2204", "PP2205", "PP2206", "PP2207"] },
  "착공/시공": { color: "#FF8C00", codes: ["PP0207", "PP0208", "PP0305", "PP0306", "PP0504", "PP0604", "PP0704", "PP0808", "PP0809", "PP0908", "PP0909", "PP0910", "PP1111", "PP1112", "PP1205", "PP1206", "PP1305", "PP1404", "PP1405", "PP1406", "PP1504", "PP1505", "PP1506", "PP1807", "PP1808", "PP1809", "PP2006", "PP2208", "PP2209"] },
  "준공/완료": { color: "#27AE60", codes: ["PP0209", "PP0210", "PP0211", "PP0307", "PP0308", "PP0505", "PP0605", "PP0705", "PP0706", "PP0810", "PP0911", "PP0912", "PP1113", "PP1207", "PP1208", "PP1306", "PP1407", "PP1507", "PP1604", "PP1810", "PP1901", "PP1902", "PP2007", "PP2210"] },
  "취소/중단": { color: "#95A5A6", codes: ["PP0104", "PP0105", "PP0212", "PP0407", "PP0506", "PP0606", "PP0707", "PP0811", "PP0913", "PP1003", "PP1106", "PP1209", "PP1210", "PP1307", "PP1408", "PP1508", "PP1605", "PP1811", "PP2008", "PP2103", "PP2211"] }
};
const SGG_COLORS = {
  "11010":"#E74C3C","11020":"#E67E22","11030":"#F1C40F","11040":"#2ECC71","11050":"#1ABC9C",
  "11060":"#3498DB","11070":"#9B59B6","11080":"#E91E63","11090":"#FF5722","11100":"#795548",
  "11110":"#607D8B","11120":"#F39C12","11130":"#27AE60","11140":"#16A085","11150":"#2980B9",
  "11160":"#8E44AD","11170":"#C0392B","11180":"#D35400","11190":"#7F8C8D","11200":"#2C3E50",
  "11210":"#E74C3C","11215":"#8E44AD","11220":"#27AE60","11230":"#2980B9","11240":"#F39C12",
  "11250":"#1ABC9C","11260":"#9B59B6","11290":"#E91E63","11305":"#FF5722","11320":"#795548",
  "11350":"#607D8B","11380":"#16A085","11410":"#C0392B","11440":"#D35400","11470":"#2ECC71",
  "11500":"#3498DB","11530":"#E67E22","11545":"#F1C40F","11560":"#8E44AD","11590":"#27AE60",
  "11620":"#16A085","11650":"#2980B9","11680":"#C0392B","11710":"#D35400","11740":"#7F8C8D"
};
const COLOR_MAP = {"":"#999999", "BZ100":"#E74C3C", "BZ200":"#3498DB", "BZ300":"#2ECC71", "BZ400":"#F39C12", "BZ500":"#9B59B6", "BZ600":"#1ABC9C"};
const BZ_PARENT = {"BZ101":"BZ100", "BZ102":"BZ100", "BZ103":"BZ100", "BZ104":"BZ100", "BZ105":"BZ100", "BZ107":"BZ100", "BZ108":"BZ100", "BZ201":"BZ200", "BZ202":"BZ200", "BZ203":"BZ200", "BZ204":"BZ200", "BZ205":"BZ200", "BZ301":"BZ300", "BZ302":"BZ300", "BZ303":"BZ300", "BZ304":"BZ300", "BZ305":"BZ300", "BZ306":"BZ300", "BZ401":"BZ400", "BZ402":"BZ400", "BZ403":"BZ400", "BZ404":"BZ400", "BZ501":"BZ500", "BZ502":"BZ500", "BZ601":"BZ600", "BZ602":"BZ600", "BZ603":"BZ600", "BZ604":"BZ600", "BZ606":"BZ600"};
const TYPE_GROUPS = [
  { code: 'BZ100', name: '정비사업', color: '#E74C3C', children: [{ code: 'BZ101', name: '신속통합기획' }, { code: 'BZ102', name: '재개발(도시정비형)' }, { code: 'BZ103', name: '재개발(주택정비형)' }, { code: 'BZ104', name: '재건축(단독)' }, { code: 'BZ105', name: '재건축(공동)' }, { code: 'BZ107', name: '주거환경개선(관리형)' }, { code: 'BZ108', name: '주거환경개선(정비형)' }] },
  { code: 'BZ200', name: '소규모정비', color: '#3498DB', children: [{ code: 'BZ201', name: '모아타운' }, { code: 'BZ202', name: '가로주택정비' }, { code: 'BZ203', name: '자율주택정비' }, { code: 'BZ204', name: '소규모재건축' }, { code: 'BZ205', name: '소규모재개발' }] },
  { code: 'BZ300', name: '역세권·공공주택', color: '#2ECC71', children: [{ code: 'BZ301', name: '장기전세주택' }, { code: 'BZ302', name: '역세권활성화' }, { code: 'BZ303', name: '청년안심주택' }, { code: 'BZ304', name: '어르신안심주택' }, { code: 'BZ305', name: '신혼부부안심주택' }, { code: 'BZ306', name: '미리내집' }] },
  { code: 'BZ400', name: '재정비촉진(뉴타운)', color: '#F39C12', children: [{ code: 'BZ401', name: '재정비촉진지구' }, { code: 'BZ402', name: '재정비촉진구역' }, { code: 'BZ403', name: '존치정비구역' }, { code: 'BZ404', name: '존치관리구역' }] },
  { code: 'BZ500', name: '공공주택·도심복합', color: '#9B59B6', children: [{ code: 'BZ501', name: '공공주택지구조성' }, { code: 'BZ502', name: '도심공공주택복합' }] },
  { code: 'BZ600', name: '도시개발·재생·기타', color: '#1ABC9C', children: [{ code: 'BZ601', name: '도시개발사업' }, { code: 'BZ602', name: '공동주택리모델링' }, { code: 'BZ603', name: '시장정비사업' }, { code: 'BZ604', name: '도시재생활성화' }, { code: 'BZ606', name: '사전협상제' }] }
];
const GU_LABELS = {"종로구":"종로구", "중구":"중구", "용산구":"용산구", "성동구":"성동구", "광진구":"광진구", "동대문구":"동대문구", "중랑구":"중랑구", "성북구":"성북구", "강북구":"강북구", "도봉구":"도봉구", "노원구":"노원구", "은평구":"은평구", "서대문구":"서대문구", "마포구":"마포구", "양천구":"양천구", "강서구":"강서구", "구로구":"구로구", "금천구":"금천구", "영등포구":"영등포구", "동작구":"동작구", "관악구":"관악구", "서초구":"서초구", "강남구":"강남구", "송파구":"송파구", "강동구":"강동구"};

const GU_LIST = ['종로구','중구','용산구','성동구','광진구','동대문구','중랑구','성북구','강북구','도봉구','노원구','은평구','서대문구','마포구','양천구','강서구','구로구','금천구','영등포구','동작구','관악구','서초구','강남구','송파구','강동구'];
const typeCounts = {};
const stageCounts = Object.fromEntries(Object.keys(STAGE_GROUPS).map(key => [key, 0]));
const guCounts = Object.fromEntries(GU_LIST.map(name => [name, 0]));

GEOJSON.features.forEach(feat => {
  const p = feat.properties || {};
  const typeCode = p['소분류'] || p['대분류'] || '';
  if (typeCode) typeCounts[typeCode] = (typeCounts[typeCode] || 0) + 1;
  const stageGroup = getStageGroup(p['추진단계'] || '');
  if (stageGroup) stageCounts[stageGroup] = (stageCounts[stageGroup] || 0) + 1;
  const guName = GU_LABELS[p['자치구']] || p['자치구'] || '';
  if (guCounts[guName] !== undefined) guCounts[guName] += 1;
});

const allTypeCodes = TYPE_GROUPS.flatMap(group => group.children.map(child => child.code));
// 기본 필터: 아래 항목만 체크, 나머지 전부 해제
const _DEFAULT_ON_TYPES = new Set([
  'BZ101',  // 신속통합기획
  'BZ102',  // 재개발(도시정비형)
  'BZ103',  // 재개발(주택정비형)
  'BZ104',  // 재건축(단독)
  'BZ105',  // 재건축(공동)
  'BZ302',  // 역세권활성화
  'BZ402',  // 재정비촉진구역
  'BZ501',  // 공공주택지구조성
  'BZ502',  // 도심공공주택복합
  'BZ601',  // 도시개발사업
  'BZ606',  // 사전협상제
]);
let checkedTypes = new Set(allTypeCodes.filter(c => _DEFAULT_ON_TYPES.has(c)));
const _DEFAULT_ON_STAGES = new Set(['계획/기획','심의/인가']);
let checkedStages = new Set(Object.keys(STAGE_GROUPS).filter(s => _DEFAULT_ON_STAGES.has(s)));
let checkedGu = new Set(GU_LIST);
let allLayers = [];
let geojsonLayer;
let searchTerm = '';
let colorMode = 'type'; // 'type' or 'stage'
let hiddenSNs = new Set(); // 개별 숨김
let highlightLayer = null; // 클릭 하이라이트
let areaMin = 0;
let areaMax = 500000;
const AREA_MAX_LIMIT = 500000;
let selectionMode = false;
let selectedItems = []; // [{sn, props, geometry}]
const selectedHighlightLayers = {}; // sn -> Leaflet layer

const map = L.map('map').setView([37.5665, 126.978], 11);
  window.map = map;
// 베이스맵 레이어 (VWorld + CARTO)
const VWORLD_KEY = 'A1B705BA-D8D0-38DF-9B5D-598162D8EC1F';
const baseStreet = L.tileLayer(`https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/Base/{z}/{y}/{x}.png`, {
  attribution: '© VWorld 국토교통부 | 서울도시공간포털 UPIS',
  maxZoom: 19
});
const baseSatellite = L.tileLayer(`https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/Satellite/{z}/{y}/{x}.jpeg`, {
  attribution: '© VWorld 국토교통부 | UPIS',
  maxZoom: 19
});
const baseHybrid = L.layerGroup([
  L.tileLayer(`https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/Satellite/{z}/{y}/{x}.jpeg`, { maxZoom: 19 }),
  L.tileLayer(`https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/Hybrid/{z}/{y}/{x}.png`, { maxZoom: 19 })
]);
const baseGray = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '© OpenStreetMap © CARTO | UPIS',
  maxZoom: 19
});
baseGray.addTo(map);
L.control.layers({
  '흑백': baseGray,
  '지도': baseStreet,
  '위성': baseSatellite,
  '하이브리드': baseHybrid
}, null, { position: 'topleft' }).addTo(map);
/* ── 팝업 드래그 ── */
map.on('popupopen', function(e) {
  const popup = e.popup;
  const el = popup._container;
  if (!el) return;
  let dragging = false, sx, sy, ox, oy;
  function parse(el) {
    const m = getComputedStyle(el).transform.match(/matrix.*\((.+)\)/);
    if (!m) return [0,0];
    const v = m[1].split(',').map(Number);
    return [v[v.length-2], v[v.length-1]];
  }
  function down(ev) {
    if (ev.target.closest('button,a,input,select,textarea')) return;
    dragging = true;
    el.classList.add('popup-dragging');
    const t = parse(el);
    ox = t[0]; oy = t[1];
    const p = ev.touches ? ev.touches[0] : ev;
    sx = p.clientX; sy = p.clientY;
    map.dragging.disable();
    ev.preventDefault();
  }
  function move(ev) {
    if (!dragging) return;
    const p = ev.touches ? ev.touches[0] : ev;
    el.style.transform = 'translate('+(ox+p.clientX-sx)+'px,'+(oy+p.clientY-sy)+'px)';
    ev.preventDefault();
  }
  function up() {
    if (!dragging) return;
    dragging = false;
    el.classList.remove('popup-dragging');
    el.classList.add('popup-dragged');
    map.dragging.enable();
  }
  const w = el.querySelector('.leaflet-popup-content-wrapper');
  if (w) {
    w.addEventListener('mousedown', down);
    w.addEventListener('touchstart', down, {passive:false});
  }
  document.addEventListener('mousemove', move);
  document.addEventListener('touchmove', move, {passive:false});
  document.addEventListener('mouseup', up);
  document.addEventListener('touchend', up);
  popup.once('remove', function() {
    if (w) { w.removeEventListener('mousedown', down); w.removeEventListener('touchstart', down); }
    document.removeEventListener('mousemove', move);
    document.removeEventListener('touchmove', move);
    document.removeEventListener('mouseup', up);
    document.removeEventListener('touchend', up);
  });
});
function getColor(lclas) {
  return COLOR_MAP[lclas] || COLOR_MAP[''] || '#999';
}

function getStageColor(ppCode) {
  for (const [gName, g] of Object.entries(STAGE_GROUPS)) {
    if (g.codes.includes(ppCode)) return g.color;
  }
  return '#999';
}

function getStageGroup(ppCode) {
  for (const [gName, g] of Object.entries(STAGE_GROUPS)) {
    if (g.codes.includes(ppCode)) return gName;
  }
  return null;
}

function styleFeature(feature) {
  const p = feature.properties;
  const fill = colorMode === 'stage'
    ? getStageColor(p['추진단계'] || '')
    : getColor(p['대분류'] || '');
  return { fillColor: fill, weight:1, opacity:0.8, color:'white', fillOpacity:0.65 };
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
}

function updateMasterCheckbox(masterId, selectedCount, totalCount) {
  const checkbox = document.getElementById(masterId);
  if (!checkbox) return;
  checkbox.checked = totalCount > 0 && selectedCount === totalCount;
  checkbox.indeterminate = selectedCount > 0 && selectedCount < totalCount;
}

function syncTypeGroupState(parentCode) {
  const group = TYPE_GROUPS.find(item => item.code === parentCode);
  if (!group) return;
  const checkbox = document.querySelector(`.type-parent[data-parent="${parentCode}"]`);
  if (!checkbox) return;
  const selected = group.children.filter(child => checkedTypes.has(child.code)).length;
  checkbox.checked = selected === group.children.length && group.children.length > 0;
  checkbox.indeterminate = selected > 0 && selected < group.children.length;
}

function renderTypeFilters() {
  const container = document.getElementById('type-filters');
  container.innerHTML = TYPE_GROUPS.map(group => {
    const parentCount = group.children.reduce((sum, child) => sum + (typeCounts[child.code] || 0), 0);
    const childHtml = group.children.length
      ? group.children.map(child => `
        <label class="filter-check child-check">
          <input type="checkbox" class="type-child" data-code="${child.code}" ${checkedTypes.has(child.code) ? 'checked' : ''}>
          <span class="filter-name">${escapeHtml(child.name)}</span>
          <span class="filter-count">${(typeCounts[child.code] || 0).toLocaleString('ko-KR')}건</span>
        </label>`).join('')
      : `<div class="filter-check child-check"><span class="filter-name">하위 분류 없음</span><span class="filter-count">0건</span></div>`;
    return `
      <div class="type-group collapsed" data-group="${group.code}">
        <div class="type-group-header">
          <button type="button" class="type-group-toggle" data-group="${group.code}"><span class="chevron">▶</span></button>
          <label class="filter-check">
            <input type="checkbox" class="type-parent" data-parent="${group.code}">
            <span class="filter-color" style="background:${group.color}"></span>
            <span class="filter-name">${escapeHtml(group.name)}</span>
            <span class="filter-count">${parentCount.toLocaleString('ko-KR')}건</span>
          </label>
        </div>
        <div class="type-group-children">${childHtml}</div>
      </div>`;
  }).join('');

  container.querySelectorAll('.type-group-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const groupEl = button.closest('.type-group');
      if (groupEl) groupEl.classList.toggle('collapsed');
    });
  });

  container.querySelectorAll('.type-child').forEach(input => {
    input.addEventListener('change', () => {
      if (input.checked) checkedTypes.add(input.dataset.code);
      else checkedTypes.delete(input.dataset.code);
      syncTypeGroupState(BZ_PARENT[input.dataset.code] || input.dataset.code);
      updateMasterCheckbox('type-all', checkedTypes.size, allTypeCodes.length);
      applyFilters();
    });
  });

  container.querySelectorAll('.type-parent').forEach(input => {
    const group = TYPE_GROUPS.find(item => item.code === input.dataset.parent);
    if (!group) return;
    input.addEventListener('change', () => {
      group.children.forEach(child => {
        if (input.checked) checkedTypes.add(child.code);
        else checkedTypes.delete(child.code);
      });
      // 하위 체크박스만 동기화 (DOM 전체 재렌더 X → 카드 닫힘 방지)
      const groupEl = input.closest('.type-group');
      if (groupEl) {
        groupEl.querySelectorAll('.type-child').forEach(cb => {
          cb.checked = input.checked;
        });
      }
      updateMasterCheckbox('type-all', checkedTypes.size, allTypeCodes.length);
      applyFilters();
    });
    syncTypeGroupState(group.code);
  });

  updateMasterCheckbox('type-all', checkedTypes.size, allTypeCodes.length);
}

function renderStageFilters() {
  const container = document.getElementById('stage-filters');
  container.innerHTML = Object.entries(STAGE_GROUPS).map(([name, cfg]) => `
    <label class="filter-check">
      <input type="checkbox" class="stage-check" data-stage="${name}" ${checkedStages.has(name) ? 'checked' : ''}>
      <span class="filter-color" style="background:${cfg.color}"></span>
      <span class="filter-name">${name}</span>
      <span class="filter-count">${(stageCounts[name] || 0).toLocaleString('ko-KR')}건</span>
    </label>`).join('');

  container.querySelectorAll('.stage-check').forEach(input => {
    input.addEventListener('change', () => {
      if (input.checked) checkedStages.add(input.dataset.stage);
      else checkedStages.delete(input.dataset.stage);
      updateMasterCheckbox('stage-all', checkedStages.size, Object.keys(STAGE_GROUPS).length);
      applyFilters();
    });
  });

  updateMasterCheckbox('stage-all', checkedStages.size, Object.keys(STAGE_GROUPS).length);
}

function renderGuFilters() {
  const container = document.getElementById('gu-filters');
  container.innerHTML = GU_LIST.map(name => `
    <label class="filter-check">
      <input type="checkbox" class="gu-check" data-gu="${name}" ${checkedGu.has(name) ? 'checked' : ''}>
      <span class="filter-name">${name}</span>
      <span class="filter-count">${(guCounts[name] || 0).toLocaleString('ko-KR')}건</span>
    </label>`).join('');

  container.querySelectorAll('.gu-check').forEach(input => {
    input.addEventListener('change', () => {
      if (input.checked) checkedGu.add(input.dataset.gu);
      else checkedGu.delete(input.dataset.gu);
      updateMasterCheckbox('gu-all', checkedGu.size, GU_LIST.length);
      applyFilters();
    });
  });

  updateMasterCheckbox('gu-all', checkedGu.size, GU_LIST.length);
}

function bindMasterCheckboxes() {
  document.getElementById('type-all').addEventListener('change', (e) => {
    checkedTypes = e.target.checked ? new Set(allTypeCodes) : new Set();
    renderTypeFilters();
    applyFilters();
  });
  document.getElementById('stage-all').addEventListener('change', (e) => {
    checkedStages = e.target.checked ? new Set(Object.keys(STAGE_GROUPS)) : new Set();
    renderStageFilters();
    applyFilters();
  });
  document.getElementById('gu-all').addEventListener('change', (e) => {
    checkedGu = e.target.checked ? new Set(GU_LIST) : new Set();
    renderGuFilters();
    applyFilters();
  });
}

// 사업명 중복 인덱스
const _nameIndex = {};
GEOJSON.features.forEach(f => {
  const nm = f.properties['사업명'] || '';
  if (!_nameIndex[nm]) _nameIndex[nm] = [];
  _nameIndex[nm].push(f.properties);
});

// 팝업 카드 생성 함수 (전역)
const _PP_MAP={"PP0101": "대상지선정(추진중)", "PP0102": "대상지선정", "PP0103": "기획완료", "PP0104": "보류", "PP0105": "취소", "PP0201": "입안제안", "PP0202": "열람공고", "PP0203": "위원회심의", "PP0204": "구역지정", "PP0205": "추진위구성", "PP0206": "조합설립인가", "PP0207": "건축심의", "PP0208": "사업시행인가", "PP0209": "관리처분계획인가", "PP0210": "착공", "PP0211": "준공", "PP0212": "취소", "PP0301": "대상지선정", "PP0302": "정비계획수립", "PP0303": "위원회심의", "PP0304": "구역지정", "PP0305": "사업시행인가", "PP0306": "착공", "PP0307": "준공(일부)", "PP0308": "준공", "PP0401": "수립범위 자문", "PP0402": "대상지선정", "PP0404": "사전자문", "PP0405": "위원회심의", "PP0406": "관리지역고시", "PP0407": "취소", "PP0500": "조합설립인가 추진중", "PP0501": "조합설립인가", "PP0502": "건축심의", "PP0503": "사업시행인가", "PP0504": "착공", "PP0505": "준공", "PP0506": "중단", "PP0601": "주민합의체 구성", "PP0602": "건축심의", "PP0603": "사업시행인가", "PP0604": "착공", "PP0605": "준공", "PP0606": "중단", "PP0701": "조합설립추진중", "PP0702": "조합설립인가", "PP0703": "건축심의", "PP0704": "사업시행계획인가", "PP0705": "착공", "PP0706": "준공", "PP0707": "중단", "PP0801": "대상지선정", "PP0802": "사전검토", "PP0803": "입안제안", "PP0804": "열람공고", "PP0805": "위원회심의", "PP0806": "구역지정", "PP0807": "건축심의", "PP0808": "사업계획승인", "PP0809": "착공", "PP0810": "준공", "PP0811": "취소", "PP0901": "대상지선정", "PP0902": "통심위 사전자문", "PP0903": "입안제안", "PP0904": "열람공고", "PP0905": "위원회심의", "PP0906": "구역지정", "PP0907": "건축심의", "PP0908": "사업계획승인", "PP0909": "건축허가", "PP0910": "착공", "PP0911": "사용승인", "PP0912": "입주", "PP0913": "취소", "PP1001": "지구지정", "PP1002": "지구변경", "PP1003": "지구해제", "PP1101": "대상지선정", "PP1102": "촉진계획수립(변경)", "PP1103": "열람공고", "PP1104": "위원회심의", "PP1105": "구역지정", "PP1106": "구역취소", "PP1107": "추진위구성", "PP1108": "조합설립인가", "PP1109": "건축심의", "PP1110": "사업시행인가", "PP1111": "관리처분계획인가", "PP1112": "착공", "PP1113": "준공", "PP1201": "예정지구지정", "PP1202": "후보지선정", "PP1203": "지구지정", "PP1204": "설계공모완료", "PP1205": "사업계획승인", "PP1206": "착공", "PP1207": "준공", "PP1208": "입주중", "PP1209": "후보지철회", "PP1210": "해제", "PP1301": "입안제안", "PP1302": "열람공고", "PP1303": "위원회심의", "PP1304": "구역지정", "PP1305": "실시계획인가", "PP1306": "준공", "PP1307": "구역지정해제", "PP1401": "조합설립인가", "PP1402": "1차 안전진단", "PP1403": "건축심의", "PP1404": "리모델링허가승인", "PP1405": "2차 안전진단", "PP1406": "착공", "PP1407": "준공", "PP1408": "취소", "PP1501": "추진계획수립중", "PP1502": "추진계획승인", "PP1503": "조합설립인가", "PP1504": "사업시행계획인가", "PP1505": "관리처분계획인가", "PP1506": "착공", "PP1507": "준공", "PP1508": "중단(실효)", "PP1601": "대상지선정", "PP1602": "활성화계획수립", "PP1603": "마중물사업(추진중)", "PP1604": "사업완료", "PP1605": "취소", "PP1801": "대상지선정", "PP1802": "통심위 사전자문", "PP1803": "입안제안", "PP1804": "열람공고", "PP1805": "위원회심의", "PP1806": "구역지정", "PP1807": "건축심의", "PP1808": "사업계획승인", "PP1809": "착공", "PP1810": "준공", "PP1811": "취소", "PP1901": "입주자 모집공고 중", "PP1902": "입주자 모집공고 완료", "PP2001": "입안제안", "PP2002": "열람공고", "PP2003": "위원회심의", "PP2004": "구역지정", "PP2005": "지구계획승인(변경)", "PP2006": "착공", "PP2007": "준공", "PP2008": "구역지정해제", "PP2101": "구역지정", "PP2102": "구역변경", "PP2103": "구역해제", "PP2201": "대상지 선정", "PP2202": "제안서접수", "PP2203": "협상조정협의회 운영", "PP2204": "협상완료", "PP2205": "입안절차 진행", "PP2206": "도시건축공동위 심의", "PP2207": "결정고시", "PP2208": "인허가 절차", "PP2209": "착공", "PP2210": "준공", "PP2211": "제외"};
const _BZ_MAP={"BZ101": "신속통합기획", "BZ102": "재개발(도시정비형)", "BZ103": "재개발(주택정비형)", "BZ104": "재건축(단독)", "BZ105": "재건축(공동)", "BZ107": "주거환경개선(관리형)", "BZ108": "주거환경개선(정비형)", "BZ201": "모아타운", "BZ202": "가로주택정비", "BZ203": "자율주택정비", "BZ204": "소규모재건축", "BZ205": "소규모재개발", "BZ301": "장기전세주택", "BZ302": "역세권활성화", "BZ303": "청년안심주택", "BZ304": "어르신안심주택", "BZ305": "신혼부부안심주택", "BZ306": "미리내집", "BZ401": "재정비촉진지구", "BZ402": "재정비촉진구역", "BZ403": "존치정비구역", "BZ404": "존치관리구역", "BZ501": "공공주택지구조성", "BZ502": "도심공공주택복합", "BZ601": "도시개발사업", "BZ602": "공동주택리모델링", "BZ603": "시장정비사업", "BZ604": "도시재생활성화", "BZ606": "사전협상제", "BZ801": "지구단위계획", "BZ802": "특별계획"};
function buildPopupCard(hp) {
  const tn = _BZ_MAP[hp['소분류']]||_BZ_MAP[hp['대분류']]||hp['소분류']||hp['대분류']||'-';
  const pn = _PP_MAP[hp['추진단계']]||hp['추진단계']||'-';
  const gn = hp['자치구']||'-';
  const am = hp['면적_m2']?Math.round(hp['면적_m2']).toLocaleString('ko-KR')+' ㎡':'-';
  return `<div style="line-height:1.5">
    <div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:4px;letter-spacing:-0.01em">${hp['사업명']||'-'}</div>
    <span style="display:inline-block;background:var(--accent-light);color:var(--accent);border-radius:2px;padding:1px 6px;font-size:11px;font-weight:600;letter-spacing:0.02em">${tn}</span>
    <div style="display:grid;grid-template-columns:auto 1fr;gap:2px 8px;margin-top:6px;font-size:12px;padding:6px 8px;background:var(--bg-secondary);border-radius:var(--radius-sm);border:1px solid var(--border-grid)">
      <span style="color:var(--text-muted);font-weight:500">자치구</span><span style="color:var(--text)">${gn}</span>
      <span style="color:var(--text-muted);font-weight:500">단계</span><span style="color:var(--text)">${pn}</span>
      <span style="color:var(--text-muted);font-weight:500">면적</span><span style="color:var(--text);font-family:var(--font-mono)">${am}</span>
    </div>
    <button onclick="hideFeature('${hp['PRESENT_SN']}')" style="margin-top:5px;padding:2px 8px;font-size:11px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg);color:var(--text-muted);cursor:pointer;font-weight:500;font-family:var(--font);transition:all .12s" onmouseover="this.style.borderColor='var(--danger)';this.style.color='var(--danger)'" onmouseout="this.style.borderColor='';this.style.color=''">\uc228\uae30\uae30</button>
  </div>`;
}

// 겹침 hits 저장
window._overlapHits = [];
window._overlapLatLng = null;
let sideMode = false; // 사이드 고정 모드

// 클릭 지점의 도시계획구역 포함 여부 검사
function _findPlanZones(latlng) {
  const zones = [];
  if (!window._PLAN_FEATURES) return zones;
  window._PLAN_FEATURES.forEach(function(f) {
    if (_pointInGeometry(latlng.lng, latlng.lat, f.geometry)) {
      zones.push({ type: f.properties['유형'], name: f.properties['구역명'] });
    }
  });
  return zones;
}

function _planZoneBadges(latlng) {
  const zones = _findPlanZones(latlng);
  if (zones.length === 0) return '';
  return zones.map(function(z) {
    var color = z.type === '지구단위계획구역' ? '#1a73e8' : '#c0392b';
    var label = z.name || z.type;
    return '<span style="display:inline-block;background:' + color + '14;color:' + color + ';border:1px solid ' + color + '40;border-radius:3px;padding:1px 7px;font-size:11px;font-weight:600;letter-spacing:0.01em;margin-right:4px;margin-bottom:2px">' + label + '</span>';
  }).join('') + '<div style="height:6px"></div>';
}

function openOverlapPopup(latlng, hits) {
  if (highlightLayer) { map.removeLayer(highlightLayer); highlightLayer = null; }
  window._overlapHits = hits;
  window._overlapLatLng = latlng;
  window._planZoneBadgeHtml = _planZoneBadges(latlng);
  // 사이드 모드면 바로 사이드 패널로
  if (sideMode) { pinToSide(); return; }
  highlightFeature(0);
  // 팝업으로 카드 나열 + 클릭 시 하이라이트 전환
  const cards = hits.map((h, idx) => {
    const sep = idx > 0 ? 'border-top:1px solid #e0e0e0;padding-top:6px;margin-top:6px;' : '';
    return `<div id="overlap-card-${idx}" onclick="highlightFeature(${idx})" style="${sep}cursor:pointer;padding:var(--sp-1);border-radius:var(--radius-sm);transition:background .1s;${idx===0?'background:var(--accent-light);':''}"
      onmouseover="this.style.background='var(--bg-hover)'" onmouseout="if(!this.classList.contains('hl-active'))this.style.background=''">
      ${buildPopupCard(h.props).replace(/^<div[^>]*>/,'').replace(/<\/div>$/,'')}
    </div>`;
  }).join('');
  const header = hits.length > 1 ? `<div style="font-size:12px;color:var(--warning);font-weight:600;margin-bottom:6px;letter-spacing:0.01em">${hits.length}\uac74 \uacb9\uce68 \u2014 \uce74\ub4dc\ub97c \ub20c\ub7ec \uc678\uacfd\uc120 \ud655\uc778</div>` : '';
  const pinBtn = `<div style="text-align:right;margin-top:var(--sp-2)"><button onclick="pinToSide()" class="popup-pin-btn">\uc0ac\uc774\ub4dc \uace0\uc815</button></div>`;
  L.popup({maxWidth:420,maxHeight:400,autoPan:false}).setLatLng(latlng).setContent(window._planZoneBadgeHtml + header + cards + pinBtn).openOn(map);
}

function highlightFeature(idx) {
  const hit = window._overlapHits[idx];
  if (!hit) return;
  if (highlightLayer) { map.removeLayer(highlightLayer); highlightLayer = null; }
  highlightLayer = L.geoJSON(hit.geometry, {
    style: { color: '#2c5ea0', weight: 4, fillOpacity: 0, dashArray: '10,5' }, interactive: false
  }).addTo(map);
  // 팝업 카드 선택 표시
  document.querySelectorAll('[id^=overlap-card-]').forEach((el, i) => {
    el.classList.remove('hl-active');
    el.style.background = i === idx ? 'var(--accent-light)' : '';
  });
  const el = document.getElementById('overlap-card-' + idx);
  if (el) el.classList.add('hl-active');
  // 사이드 패널 카드 선택 표시
  document.querySelectorAll('#detail-panel .detail-card').forEach((el, i) => {
    el.classList.toggle('active', i === idx);
  });
}

// 팝업 → 사이드 패널
function pinToSide() {
  sideMode = true;
  map.closePopup();
  const panel = document.getElementById('detail-panel');
  const legend = document.getElementById('legend');
  // 레전드 열기
  if (legend.classList.contains('collapsed')) {
    legend.classList.remove('collapsed');
    document.getElementById('legend-toggle').style.display = 'none';
  }
  const hits = window._overlapHits;
  const header = hits.length > 1
    ? `<div class="detail-header"><span>${hits.length}\uac74 \uacb9\uce68</span><button onclick="closeSidePanel()" title="\ub2eb\uae30">\u2715</button></div>`
    : `<div class="detail-header"><span>\uc0ac\uc5c5 \uc0c1\uc138</span><button onclick="closeSidePanel()" title="\ub2eb\uae30">\u2715</button></div>`;
  const cards = hits.map((h, idx) => {
    return `<div class="detail-card${idx===0?' active':''}" onclick="highlightFeature(${idx})">
      ${buildPopupCard(h.props).replace(/^<div[^>]*>/,'').replace(/<\/div>$/,'')}
    </div>`;
  }).join('');
  const popupBtn = `<div style="text-align:right;margin-top:var(--sp-2)"><button onclick="sideToPopup()" class="popup-pin-btn">\ud31d\uc5c5\uc73c\ub85c</button></div>`;
  panel.innerHTML = (window._planZoneBadgeHtml || '') + header + cards + popupBtn;
  panel.classList.add('show');
  // 첫 항목 하이라이트 유지
  highlightFeature(0);
}

// 사이드 패널 → 팝업
function sideToPopup() {
  sideMode = false;
  closeSidePanel();
  if (window._overlapLatLng && window._overlapHits.length > 0) {
    openOverlapPopup(window._overlapLatLng, window._overlapHits);
  }
}

// 사이드 패널 닫기
function closeSidePanel() {
  sideMode = false;
  const panel = document.getElementById('detail-panel');
  panel.classList.remove('show');
  panel.innerHTML = '';
  if (highlightLayer) { map.removeLayer(highlightLayer); highlightLayer = null; }
}

/* ── point-in-polygon (ray casting) ── */
function _pointInRing(x, y, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function _pointInPolygon(x, y, coords) {
  if (!_pointInRing(x, y, coords[0])) return false;
  for (let h = 1; h < coords.length; h++) { if (_pointInRing(x, y, coords[h])) return false; }
  return true;
}
function _pointInGeometry(lng, lat, geom) {
  if (geom.type === 'Polygon') return _pointInPolygon(lng, lat, geom.coordinates);
  if (geom.type === 'MultiPolygon') return geom.coordinates.some(c => _pointInPolygon(lng, lat, c));
  return false;
}
window._pointInGeometry = _pointInGeometry;

function onEachFeature(feature, layer) {
  const p = feature.properties;
  const 면적 = p['면적_m2'] ? (p['면적_m2'] / 10000).toFixed(2) + ' ha' : '-';
  const _SGG={"종로구":"종로구", "중구":"중구", "용산구":"용산구", "성동구":"성동구", "광진구":"광진구", "동대문구":"동대문구", "중랑구":"중랑구", "성북구":"성북구", "강북구":"강북구", "도봉구":"도봉구", "노원구":"노원구", "은평구":"은평구", "서대문구":"서대문구", "마포구":"마포구", "양천구":"양천구", "강서구":"강서구", "구로구":"구로구", "금천구":"금천구", "영등포구":"영등포구", "동작구":"동작구", "관악구":"관악구", "서초구":"서초구", "강남구":"강남구", "송파구":"송파구", "강동구":"강동구"};
  const _BZ={"BZ101": "신속통합기획", "BZ102": "재개발(도시정비형)", "BZ103": "재개발(주택정비형)", "BZ104": "재건축(단독)", "BZ105": "재건축(공동)", "BZ107": "주거환경개선(관리형)", "BZ108": "주거환경개선(정비형)", "BZ201": "모아타운", "BZ202": "가로주택정비", "BZ203": "자율주택정비", "BZ204": "소규모재건축", "BZ205": "소규모재개발", "BZ301": "장기전세주택", "BZ302": "역세권활성화", "BZ303": "청년안심주택", "BZ304": "어르신안심주택", "BZ305": "신혼부부안심주택", "BZ306": "미리내집", "BZ401": "재정비촉진지구", "BZ402": "재정비촉진구역", "BZ403": "존치정비구역", "BZ404": "존치관리구역", "BZ501": "공공주택지구조성", "BZ502": "도심공공주택복합", "BZ601": "도시개발사업", "BZ602": "공동주택리모델링", "BZ603": "시장정비사업", "BZ604": "도시재생활성화", "BZ606": "사전협상제", "BZ801": "지구단위계획", "BZ802": "특별계획"};
  const _PP={"PP0101": "대상지선정(추진중)", "PP0102": "대상지선정", "PP0103": "기획완료", "PP0104": "보류", "PP0105": "취소", "PP0201": "입안제안", "PP0202": "열람공고", "PP0203": "위원회심의", "PP0204": "구역지정", "PP0205": "추진위구성", "PP0206": "조합설립인가", "PP0207": "건축심의", "PP0208": "사업시행인가", "PP0209": "관리처분계획인가", "PP0210": "착공", "PP0211": "준공", "PP0212": "취소", "PP0301": "대상지선정", "PP0302": "정비계획수립", "PP0303": "위원회심의", "PP0304": "구역지정", "PP0305": "사업시행인가", "PP0306": "착공", "PP0307": "준공(일부)", "PP0308": "준공", "PP0401": "수립범위 자문", "PP0402": "대상지선정", "PP0404": "사전자문", "PP0405": "위원회심의", "PP0406": "관리지역고시", "PP0407": "취소", "PP0500": "조합설립인가 추진중", "PP0501": "조합설립인가", "PP0502": "건축심의", "PP0503": "사업시행인가", "PP0504": "착공", "PP0505": "준공", "PP0506": "중단", "PP0601": "주민합의체 구성", "PP0602": "건축심의", "PP0603": "사업시행인가", "PP0604": "착공", "PP0605": "준공", "PP0606": "중단", "PP0701": "조합설립추진중", "PP0702": "조합설립인가", "PP0703": "건축심의", "PP0704": "사업시행계획인가", "PP0705": "착공", "PP0706": "준공", "PP0707": "중단", "PP0801": "대상지선정", "PP0802": "사전검토", "PP0803": "입안제안", "PP0804": "열람공고", "PP0805": "위원회심의", "PP0806": "구역지정", "PP0807": "건축심의", "PP0808": "사업계획승인", "PP0809": "착공", "PP0810": "준공", "PP0811": "취소", "PP0901": "대상지선정", "PP0902": "통심위 사전자문", "PP0903": "입안제안", "PP0904": "열람공고", "PP0905": "위원회심의", "PP0906": "구역지정", "PP0907": "건축심의", "PP0908": "사업계획승인", "PP0909": "건축허가", "PP0910": "착공", "PP0911": "사용승인", "PP0912": "입주", "PP0913": "취소", "PP1001": "지구지정", "PP1002": "지구변경", "PP1003": "지구해제", "PP1101": "대상지선정", "PP1102": "촉진계획수립(변경)", "PP1103": "열람공고", "PP1104": "위원회심의", "PP1105": "구역지정", "PP1106": "구역취소", "PP1107": "추진위구성", "PP1108": "조합설립인가", "PP1109": "건축심의", "PP1110": "사업시행인가", "PP1111": "관리처분계획인가", "PP1112": "착공", "PP1113": "준공", "PP1201": "예정지구지정", "PP1202": "후보지선정", "PP1203": "지구지정", "PP1204": "설계공모완료", "PP1205": "사업계획승인", "PP1206": "착공", "PP1207": "준공", "PP1208": "입주중", "PP1209": "후보지철회", "PP1210": "해제", "PP1301": "입안제안", "PP1302": "열람공고", "PP1303": "위원회심의", "PP1304": "구역지정", "PP1305": "실시계획인가", "PP1306": "준공", "PP1307": "구역지정해제", "PP1401": "조합설립인가", "PP1402": "1차 안전진단", "PP1403": "건축심의", "PP1404": "리모델링허가승인", "PP1405": "2차 안전진단", "PP1406": "착공", "PP1407": "준공", "PP1408": "취소", "PP1501": "추진계획수립중", "PP1502": "추진계획승인", "PP1503": "조합설립인가", "PP1504": "사업시행계획인가", "PP1505": "관리처분계획인가", "PP1506": "착공", "PP1507": "준공", "PP1508": "중단(실효)", "PP1601": "대상지선정", "PP1602": "활성화계획수립", "PP1603": "마중물사업(추진중)", "PP1604": "사업완료", "PP1605": "취소", "PP1801": "대상지선정", "PP1802": "통심위 사전자문", "PP1803": "입안제안", "PP1804": "열람공고", "PP1805": "위원회심의", "PP1806": "구역지정", "PP1807": "건축심의", "PP1808": "사업계획승인", "PP1809": "착공", "PP1810": "준공", "PP1811": "취소", "PP1901": "입주자 모집공고 중", "PP1902": "입주자 모집공고 완료", "PP2001": "입안제안", "PP2002": "열람공고", "PP2003": "위원회심의", "PP2004": "구역지정", "PP2005": "지구계획승인(변경)", "PP2006": "착공", "PP2007": "준공", "PP2008": "구역지정해제", "PP2101": "구역지정", "PP2102": "구역변경", "PP2103": "구역해제", "PP2201": "대상지 선정", "PP2202": "제안서접수", "PP2203": "협상조정협의회 운영", "PP2204": "협상완료", "PP2205": "입안절차 진행", "PP2206": "도시건축공동위 심의", "PP2207": "결정고시", "PP2208": "인허가 절차", "PP2209": "착공", "PP2210": "준공", "PP2211": "제외"};
  const sggNm=_SGG[p['자치구']]||p['자치구']||'-';
  const ppNm=_PP[p['추진단계']]||p['추진단계']||'-';
  const typeNm=_BZ[p['소분류']]||_BZ[p['대분류']]||p['소분류']||p['대분류']||'-';
  const m2=p['면적_m2']?Math.round(p['면적_m2']).toLocaleString('ko-KR')+' ㎡':'-';
  // 클릭 시 같은 사업명의 모든 트랙 표시
  layer.on('click', function(e) {
    L.DomEvent.stopPropagation(e);
    if (selectionMode) {
      const sn = p['PRESENT_SN'];
      if (sn) toggleSelectedFeature(sn, p, feature.geometry);
      return;
    }
    const latlng = e.latlng;
    // point-in-polygon ray casting (정확한 겹침 감지)
    const hits = [];
    const seen = new Set();
    allLayers.forEach(item => {
      if (!item.layer._map) return;
      try {
        // bounds 사전 필터 + 실제 PIP 검사
        if (item.layer.getBounds && item.layer.getBounds().contains(latlng)) {
          if (_pointInGeometry(latlng.lng, latlng.lat, item.geometry)) {
            const sn = item.props['PRESENT_SN'];
            if (!seen.has(sn)) { seen.add(sn); hits.push({ props: item.props, geometry: item.geometry }); }
          }
        }
      } catch(ex) {}
    });
    if (hits.length === 0) hits.push({ props: p, geometry: feature.geometry });
    openOverlapPopup(latlng, hits);
  });
  allLayers.push({ layer, props: p, geometry: feature.geometry });
}


geojsonLayer = L.geoJSON(GEOJSON, {
  style: styleFeature,
  onEachFeature: onEachFeature
}).addTo(map);

// 팝업 닫으면 하이라이트 제거
map.on('popupclose', function() {
  if (highlightLayer) { map.removeLayer(highlightLayer); highlightLayer = null; }
});

document.getElementById('search').addEventListener('input', (e) => {
  searchTerm = e.target.value.trim().toLowerCase();
  applyFilters();
});

function applyFilters() {
  geojsonLayer.clearLayers();
  allLayers = [];

  const filtered = GEOJSON.features.filter(feat => {
    const p = feat.properties || {};
    const rawType = p['대분류'] || '';
    const typeCode = BZ_PARENT[rawType] ? rawType : (p['소분류'] || rawType || '');
    if (!checkedTypes.has(typeCode)) return false;

    const stageGroup = getStageGroup(p['추진단계'] || '');
    if (!stageGroup || !checkedStages.has(stageGroup)) return false;

    const guName = GU_LABELS[p['자치구']] || p['자치구'] || '';
    if (!checkedGu.has(guName)) return false;

    const area = p['면적_m2'] || 0;
    const areaFiltered = (areaMin > 0 || areaMax < AREA_MAX_LIMIT);
    if (area <= 0 && areaFiltered) return false;
    if (area > 0) {
      if (area < areaMin) return false;
      if (areaMax < AREA_MAX_LIMIT && area > areaMax) return false;
    }

    if (hiddenSNs.has(p['PRESENT_SN'])) return false;

    if (searchTerm) {
      const name = (p['사업명'] || '').toLowerCase();
      const addr = (p['주소'] || '').toLowerCase();
      if (!name.includes(searchTerm) && !addr.includes(searchTerm)) return false;
    }

    return true;
  });

  L.geoJSON({ type: 'FeatureCollection', features: filtered }, {
    style: styleFeature,
    onEachFeature: onEachFeature
  }).addTo(geojsonLayer);

  const hiddenCount = hiddenSNs.size > 0 ? ` (${hiddenSNs.size}건 숨김)` : '';
  document.getElementById('counter').textContent = `${filtered.length.toLocaleString('ko-KR')}건 표시 중 (전체 ${GEOJSON.features.length.toLocaleString('ko-KR')}건)${hiddenCount}`;
}

// 색상 모드 전환
document.querySelectorAll('.color-mode-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.color-mode-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    colorMode = this.dataset.mode;
    applyFilters();
  });
});

// SN → 사업명 조회 인덱스
const _snNameMap = {};
GEOJSON.features.forEach(f => {
  const p = f.properties;
  if (p.PRESENT_SN) _snNameMap[p.PRESENT_SN] = p['사업명'] || p.PRESENT_SN;
});

// 개별 필지 숨기기 (팝업 버튼에서 호출)
function hideFeature(sn) {
  if (!sn) return;
  hiddenSNs.add(sn);
  map.closePopup();
  applyFilters();
  updateHiddenUI();
}

function restoreFeature(sn) {
  hiddenSNs.delete(sn);
  applyFilters();
  updateHiddenUI();
}

function updateHiddenUI() {
  const btn = document.getElementById('restore-hidden');
  const wrap = document.getElementById('hidden-list-wrap');
  const list = document.getElementById('hidden-list');
  if (hiddenSNs.size > 0) {
    btn.textContent = `숨긴 필지 복원 (${hiddenSNs.size}건)`;
    btn.classList.add('show');
    wrap.classList.add('show');
    list.innerHTML = Array.from(hiddenSNs).map(sn => {
      const name = _snNameMap[sn] || sn;
      return `<div class="hidden-item"><span class="hidden-item-name" title="${name}">${name}</span><button class="hidden-item-restore" onclick="restoreFeature('${sn}')">\u21a9 복원</button></div>`;
    }).join('');
  } else {
    btn.classList.remove('show');
    wrap.classList.remove('show');
    list.innerHTML = '';
  }
}
document.getElementById('restore-hidden').addEventListener('click', function() {
  hiddenSNs.clear();
  applyFilters();
  updateHiddenUI();
});

bindMasterCheckboxes();
renderTypeFilters();
renderStageFilters();
renderGuFilters();

// 면적 슬라이더+입력 동기화
function syncAreaUI() {
  document.getElementById('area-min').value = areaMin;
  document.getElementById('area-max').value = areaMax;
  document.getElementById('area-min-input').value = areaMin;
  document.getElementById('area-max-input').value = areaMax;
}
document.getElementById('area-min').addEventListener('input', function() {
  areaMin = parseInt(this.value) || 0;
  if (areaMin > areaMax) { areaMax = areaMin; }
  syncAreaUI(); applyFilters();
});
document.getElementById('area-max').addEventListener('input', function() {
  areaMax = parseInt(this.value) || 0;
  if (areaMax < areaMin) { areaMin = areaMax; }
  syncAreaUI(); applyFilters();
});
document.getElementById('area-min-input').addEventListener('change', function() {
  areaMin = Math.max(0, Math.min(500000, parseInt(this.value) || 0));
  if (areaMin > areaMax) { areaMax = areaMin; }
  syncAreaUI(); applyFilters();
});
document.getElementById('area-max-input').addEventListener('change', function() {
  areaMax = Math.max(0, Math.min(500000, parseInt(this.value) || 0));
  if (areaMax < areaMin) { areaMin = areaMax; }
  syncAreaUI(); applyFilters();
});
// 프리셋 버튼 — 토글 방식 (중복선택 가능, 범위 합산)
document.querySelectorAll('.area-preset-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const isAll = this.dataset.min === '0' && this.dataset.max === '500000';
    if (isAll) {
      // '전체' 누르면 다른 프리셋 해제, 전체 범위로
      document.querySelectorAll('.area-preset-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      areaMin = 0; areaMax = 500000;
    } else {
      // '전체' 해제
      document.querySelector('.area-preset-btn[data-min="0"][data-max="500000"]').classList.remove('active');
      this.classList.toggle('active');
      // 활성 프리셋들의 범위 합산
      const actives = document.querySelectorAll('.area-preset-btn.active');
      if (actives.length === 0) {
        // 아무것도 없으면 전체로
        document.querySelector('.area-preset-btn[data-min="0"][data-max="500000"]').classList.add('active');
        areaMin = 0; areaMax = 500000;
      } else {
        areaMin = Infinity; areaMax = 0;
        actives.forEach(b => {
          areaMin = Math.min(areaMin, parseInt(b.dataset.min));
          areaMax = Math.max(areaMax, parseInt(b.dataset.max));
        });
      }
    }
    syncAreaUI(); applyFilters();
  });
});

// ─── Selection Mode ──────────────────────────────────────────────────────────
function _renderSelectionPanel() {
  const panel = document.getElementById('selection-panel');
  if (selectedItems.length === 0) {
    panel.classList.remove('show');
    return;
  }
  panel.classList.add('show');

  const totalAreaM2 = selectedItems.reduce((s, item) => s + (item.props['면적_m2'] || 0), 0);
  const totalPyeong = Math.round(totalAreaM2 * 0.3025);
  document.getElementById('sel-summary').innerHTML =
    `총 <strong>${selectedItems.length}건</strong> · 합산 <strong>${Math.round(totalAreaM2).toLocaleString('ko-KR')}㎡</strong> (약 <strong>${totalPyeong.toLocaleString('ko-KR')}평</strong>)`;

  document.getElementById('sel-list').innerHTML = selectedItems.map(item => {
    const p = item.props;
    const name = p['사업명'] || '-';
    const gu = p['자치구'] || '-';
    const m2 = p['면적_m2'] ? Math.round(p['면적_m2']).toLocaleString('ko-KR') + ' ㎡' : '-';
    const pyeong = p['면적_m2'] ? Math.round(p['면적_m2'] * 0.3025).toLocaleString('ko-KR') + '평' : '-';
    const typeCode = p['소분류'] || p['대분류'] || '';
    const typeName = _BZ_MAP[typeCode] || typeCode || '-';
    const stageCode = p['추진단계'] || '';
    const stageName = _PP_MAP[stageCode] || stageCode || '-';
    const addr = p['주소'] || '정보 없음';
    const snEsc = escapeHtml(item.sn);
    return `<div class="sel-item">
      <div class="sel-item-header">
        <div class="sel-item-name">${escapeHtml(name)}</div>
        <button class="sel-remove-btn" onclick="removeSelectedFeature('${snEsc}')" title="선택 해제">✕</button>
      </div>
      <div class="sel-item-meta">
        <span class="meta-key">자치구</span><span class="meta-val">${escapeHtml(gu)}</span>
        <span class="meta-key">면적</span><span class="meta-val" style="font-family:var(--font-mono)">${m2} (${pyeong})</span>
        <span class="meta-key">유형</span><span class="meta-val">${escapeHtml(typeName)}</span>
        <span class="meta-key">단계</span><span class="meta-val">${escapeHtml(stageName)}</span>
        <span class="meta-key">주소</span><span class="meta-val">${escapeHtml(addr)}</span>
      </div>
    </div>`;
  }).join('');
}

function toggleSelectedFeature(sn, props, geometry) {
  const idx = selectedItems.findIndex(item => item.sn === sn);
  if (idx >= 0) {
    selectedItems.splice(idx, 1);
    if (selectedHighlightLayers[sn]) { map.removeLayer(selectedHighlightLayers[sn]); delete selectedHighlightLayers[sn]; }
  } else {
    selectedItems.push({ sn, props, geometry });
    selectedHighlightLayers[sn] = L.geoJSON({ type: 'Feature', geometry }, {
      style: { color: '#2c5ea0', weight: 3, fillColor: '#FFD700', fillOpacity: 0.25, dashArray: '8,4' },
      interactive: false
    }).addTo(map);
  }
  _renderSelectionPanel();
}

window.removeSelectedFeature = function(sn) {
  const idx = selectedItems.findIndex(item => item.sn === sn);
  if (idx >= 0) {
    selectedItems.splice(idx, 1);
    if (selectedHighlightLayers[sn]) { map.removeLayer(selectedHighlightLayers[sn]); delete selectedHighlightLayers[sn]; }
  }
  _renderSelectionPanel();
};

window.clearAllSelected = function() {
  selectedItems.forEach(item => {
    if (selectedHighlightLayers[item.sn]) { map.removeLayer(selectedHighlightLayers[item.sn]); delete selectedHighlightLayers[item.sn]; }
  });
  selectedItems.length = 0;
  _renderSelectionPanel();
};

window.toggleSelectionMode = function() {
  selectionMode = !selectionMode;
  const btn = document.getElementById('selection-mode-btn');
  btn.classList.toggle('active', selectionMode);
  btn.title = selectionMode ? '선택 모드 끄기' : '선택 모드 켜기 — 필지 클릭하면 선택됩니다';
};

window.takeScreenshot = async function() {
  if (typeof html2canvas === 'undefined') { alert('html2canvas 라이브러리를 불러오지 못했습니다.'); return; }
  const btn = document.getElementById('screenshot-btn');
  const orig = btn.textContent;
  btn.textContent = '캡처 중...';
  btn.disabled = true;
  try {
    const canvas = await html2canvas(document.body, { useCORS: true, allowTaint: true, logging: false, scale: window.devicePixelRatio || 1 });
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const fname = `서울_개발사업_지도_${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}.png`;
    const a = document.createElement('a');
    a.download = fname;
    a.href = canvas.toDataURL('image/png');
    a.click();
  } catch(err) {
    console.error('Screenshot failed:', err);
    alert('스크린샷 캡처에 실패했습니다.');
  }
  btn.textContent = orig;
  btn.disabled = false;
};

applyFilters();
}
initApp();
