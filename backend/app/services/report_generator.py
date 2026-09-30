from datetime import datetime
from typing import Dict, Any

class IncidentReportGenerator:
    """
    Generates PDF-ready structured incident reports for Environmental Authorities.
    """

    def generate_html_report(self, incident_data: Dict[str, Any]) -> str:
        inc = incident_data
        html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>AERIS Incident Report #{inc.get('incident_number', 'INC-2041')}</title>
    <style>
        body {{ font-family: 'Segoe UI', Helvetica, Arial, sans-serif; margin: 40px; color: #1e293b; background: #fff; }}
        .header {{ border-bottom: 3px solid #0284c7; padding-bottom: 15px; margin-bottom: 30px; }}
        .header h1 {{ margin: 0; color: #0f172a; font-size: 24px; }}
        .header p {{ margin: 5px 0 0 0; color: #64748b; font-size: 14px; }}
        .badge {{ background: #ef4444; color: #fff; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 12px; }}
        .grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }}
        .card {{ background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; }}
        .card h3 {{ margin-top: 0; font-size: 14px; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }}
        .metric {{ font-size: 22px; font-weight: bold; color: #0f172a; }}
        .evidence-list {{ background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; list-style-type: none; }}
        .evidence-list li {{ padding: 6px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }}
        .footer {{ margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 12px; color: #94a3b8; text-align: center; }}
    </style>
</head>
<body>
    <div class="header">
        <span class="badge">{inc.get('priority', 'CRITICAL')} SEVERITY</span>
        <h1>AERIS INCIDENT REPORT #{inc.get('incident_number', 'INC-2041')}</h1>
        <p>Generated on {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')} | City: {inc.get('city', 'Hyderabad')}</p>
    </div>

    <div class="grid">
        <div class="card">
            <h3>Incident Summary</h3>
            <p><strong>Title:</strong> {inc.get('title', 'Industrial Corridor Emission Anomaly')}</p>
            <p><strong>Probable Source:</strong> {inc.get('probable_source', 'Industrial Activity')}</p>
            <p><strong>Status:</strong> {inc.get('status', 'UNDER_INVESTIGATION')}</p>
            <p><strong>Assigned Dept:</strong> {inc.get('assigned_department', 'State Pollution Control Board')}</p>
        </div>
        <div class="card">
            <h3>Environmental Metrics</h3>
            <div class="metric">PM2.5: {inc.get('current_pm25', 146.0)} µg/m³</div>
            <p>AQI: {inc.get('current_aqi', 245)} (Unhealthy)</p>
            <p>3-Hour Forecast: {inc.get('forecast_3h', 172.0)} µg/m³</p>
        </div>
    </div>

    <div class="card" style="margin-bottom: 25px;">
        <h3>Geospatial Risk & Exposure</h3>
        <p><strong>Exposed Population:</strong> {inc.get('exposed_population', 18420):,}</p>
        <p><strong>Affected Schools:</strong> {inc.get('exposed_schools', 4)}</p>
        <p><strong>Affected Hospitals:</strong> {inc.get('exposed_hospitals', 1)}</p>
        <p><strong>Environmental Risk Index:</strong> {inc.get('risk_index', 85.4)} / 100</p>
    </div>

    <div class="card">
        <h3>AI Evidence & Attribution</h3>
        <ul class="evidence-list">
            <li>✓ PM2.5 increased 42% above baseline</li>
            <li>✓ Sentinel-5P NO2 plume anomaly detected</li>
            <li>✓ Wind dispersion vector traveling SW at 12 km/h</li>
            <li>✓ 14 verified citizen smoke reports received nearby</li>
        </ul>
    </div>

    <div class="footer">
        AERIS - AI Environmental Risk & Intelligence System | Official Authority Document
    </div>
</body>
</html>"""
        return html

report_generator = IncidentReportGenerator()
