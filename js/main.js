const _urlData = "https://www.datos.gov.co/resource/sfav-4met.json"


var vlSpec = {
    "data": { "url": "https://www.datos.gov.co/resource/sfav-4met.json" },
    "transform": [{ "fold": ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "_noviembre"] }],
    "mark": "bar",
    "encoding": {
        "column": { "field": "indicadores", "type": "nominal" },
        "color": {"field": "key", "type": "nominal"},
        "y": { "field": "value", "type": "quantitative" },
        "x": { "field": "key", "type": "nominal" },
        "tooltip": { "field": "value", "type": "quantitative" },
        "width": { "step": 12 }
    }
};
console.log(vlSpec);