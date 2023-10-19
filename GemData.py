import os
import requests
from bs4 import BeautifulSoup

def handler(event, context):
    report_number = event['queryStringParameters']['reportNumber']

    if not report_number:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Report number is required'}),
            'headers': {
                'Access-Control-Allow-Origin': 'https://andoultra.github.io',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        }

    try:
        # Send an HTTP GET request to the target URL
        url = 'https://www.gia.edu/report-check-landing'
        response = requests.get(url)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Parse the HTML content using Beautiful Soup
            soup = BeautifulSoup(response.text, 'html.parser')

            # Find the element with the id 'SHAPE' and extract its text
            report_data_element = soup.find(id='SHAPE')
            report_data = report_data_element.get_text() if report_data_element else 'Data not found'

            return {
                'statusCode': 200,
                'body': json.dumps({'data': report_data}),
                'headers': {
                    'Access-Control-Allow-Origin': 'https://andoultra.github.io',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            }
        else:
            return {
                'statusCode': response.status_code,
                'body': json.dumps({'error': 'Failed to retrieve data'}),
                'headers': {
                    'Access-Control-Allow-Origin': 'https://andoultra.github.io',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to retrieve data: ' + str(e)}),
            'headers': {
                'Access-Control-Allow-Origin': 'https://andoultra.github.io',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        }
