import requests
from bs4 import BeautifulSoup
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/gem_scrape', methods=['POST'])
def scrape_gem_info():
    try:
        giaCertification = request.json['giaCertification']
        
        url = 'https://www.gia.edu/report-check-landing'
        data = {'reportno': giaCertification}
        
        # First request to awaken the page
        session = requests.Session()
        session.get(url)
    
        # Second request to submit the form
        response = session.post(url, data=data)
    
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            # Extract the information you need, e.g., SHAPE
            shape_element = soup.find(id='SHAPE')
            if shape_element:
                shape = shape_element.text.strip()
                return jsonify({"description": f"Gem Shape: {shape}"})
            else:
                return jsonify({"description": "Shape not found"})
        else:
            return jsonify({"description": "Failed to fetch data"})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run()
