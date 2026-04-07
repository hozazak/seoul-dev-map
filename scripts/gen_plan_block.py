#!/usr/bin/env python3
"""GeoJSON → HTML script 블록 생성 (v3: 단일 pane + map click fallback)"""
import json

with open('/Users/youngbin/.openclaw/workspace/seoul-dev-map/output/district_plan.geojson') as f:
    data = json.load(f)

def round_coords(coords, precision=5):
    if isinstance(coords[0], (int, float)):
        return [round(c, precision) for c in coords]
    return [round_coords(c, precision) for c in coords]

for feat in data['features']:
    feat['geometry']['coordinates'] = round_coords(feat['geometry']['coordinates'])

compact = json.dumps(data, ensure_ascii=False, separators=(',',':'))
print(f"Data size: {len(compact)} chars")

JS_TEMPLATE = r"""<script>
// === 도시계획구역 레이어 (지구단위+특별계획) ===
(function(){
var _PLAN_DATA = __DATA__;
window._PLAN_FEATURES = _PLAN_DATA.features;

// 시각 pane: 사업 레이어(z=400) 위에 점선 표시, 클릭 투과
map.createPane('planZoneVisual');
map.getPane('planZoneVisual').style.zIndex = 450;
map.getPane('planZoneVisual').style.pointerEvents = 'none';

function planPopupHtml(p) {
  var type = p['\uc720\ud615'];
  var color = type === '\uc9c0\uad6c\ub2e8\uc704\uacc4\ud68d\uad6c\uc5ed' ? '#2c5ea0' : '#c0392b';
  var area = p['\uba74\uc801_m2'] ? Math.round(p['\uba74\uc801_m2']).toLocaleString('ko-KR') + ' \u33a1' : '-';
  var date = p['\uc9c0\uc815\uc77c'] || '-';
  return '<div style="font-family:var(--font);max-width:280px">'
    + '<div style="font-weight:600;font-size:14px;margin-bottom:4px;color:' + color + '">' + (p['\uad6c\uc5ed\uba85'] || '-') + '</div>'
    + '<div style="font-size:12px;color:#666;display:grid;grid-template-columns:auto 1fr;gap:2px 8px">'
    + '<span style="color:#999">\uc720\ud615</span><span style="color:' + color + ';font-weight:500">' + type + '</span>'
    + '<span style="color:#999">\uc790\uce58\uad6c</span><span>' + (p['\uc790\uce58\uad6c'] || '-') + '</span>'
    + '<span style="color:#999">\uba74\uc801</span><span style="font-family:var(--font-mono)">' + area + '</span>'
    + '<span style="color:#999">\uc9c0\uc815\uc77c</span><span>' + date + '</span>'
    + '</div></div>';
}

// 시각 전용 레이어 (점선 표시만)
var districtVisual = L.geoJSON(null, {
  pane: 'planZoneVisual',
  filter: function(f){ return f.properties['\uc720\ud615'] === '\uc9c0\uad6c\ub2e8\uc704\uacc4\ud68d\uad6c\uc5ed'; },
  style: { color: '#2c5ea0', weight: 1.5, dashArray: '6 4', fillColor: '#2c5ea0', fillOpacity: 0.05, interactive: false }
});
var specialVisual = L.geoJSON(null, {
  pane: 'planZoneVisual',
  filter: function(f){ return f.properties['\uc720\ud615'] === '\ud2b9\ubcc4\uacc4\ud68d\uad6c\uc5ed'; },
  style: { color: '#c0392b', weight: 1.5, dashArray: '6 4', fillColor: '#c0392b', fillOpacity: 0.08, interactive: false }
});

districtVisual.addData(_PLAN_DATA);
specialVisual.addData(_PLAN_DATA);

// 지도 클릭 fallback: 사업 레이어에 안 맞으면 구역 PIP → 팝업
// (사업 레이어 클릭 핸들러가 stopPropagation하므로, 여기까지 오면 사업 없는 곳)
var _districtOn = false, _specialOn = false;
map.on('click', function(e) {
  if (!_districtOn && !_specialOn) return;
  var zones = [];
  window._PLAN_FEATURES.forEach(function(f) {
    if (_pointInGeometry(e.latlng.lng, e.latlng.lat, f.geometry)) {
      var type = f.properties['\uc720\ud615'];
      if (type === '\uc9c0\uad6c\ub2e8\uc704\uacc4\ud68d\uad6c\uc5ed' && _districtOn) zones.push(f);
      if (type === '\ud2b9\ubcc4\uacc4\ud68d\uad6c\uc5ed' && _specialOn) zones.push(f);
    }
  });
  if (zones.length === 0) return;
  var html = zones.map(function(f){ return planPopupHtml(f.properties); }).join('<hr style="border:none;border-top:1px solid #e0e0e0;margin:6px 0">');
  L.popup({maxWidth:300}).setLatLng(e.latlng).setContent(html).openOn(map);
});

var dToggle = document.getElementById('toggle-district-plan');
var sToggle = document.getElementById('toggle-special-plan');

dToggle.addEventListener('change', function(){
  _districtOn = this.checked;
  if(this.checked) districtVisual.addTo(map);
  else map.removeLayer(districtVisual);
});
sToggle.addEventListener('change', function(){
  _specialOn = this.checked;
  if(this.checked) specialVisual.addTo(map);
  else map.removeLayer(specialVisual);
});
})();
</script>"""

block = JS_TEMPLATE.replace('__DATA__', compact)
out = '/Users/youngbin/.openclaw/workspace/seoul-dev-map/output/_plan_zone_block.html'
with open(out, 'w', encoding='utf-8') as f:
    f.write(block)
print(f"블록 저장: {out} ({len(block)} bytes)")
