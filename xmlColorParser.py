import xml.etree.ElementTree as ET

file_path = './catalog.xml'

with open(file_path, 'r') as file:
    xml_data = file.read()

namespace = {'ns': 'http://www.demandware.com/xml/impex/catalog/2006-10-31'}
root = ET.fromstring(xml_data)

color_mapping = {}

for product in root.findall('.//ns:product', namespace):
    product_id = product.get('product-id')

    custom_attributes = product.find('./ns:custom-attributes', namespace)

    if custom_attributes is not None:
        color_attribute = custom_attributes.find(
            './ns:custom-attribute[@attribute-id="color"]', namespace)
        refinement_color_attribute = custom_attributes.find(
            './ns:custom-attribute[@attribute-id="refinementColor"]', namespace)

        if color_attribute is not None and refinement_color_attribute is not None:
            color_code = color_attribute.text
            color_name = refinement_color_attribute.text

            dict_key = color_mapping.get(color_name, None)

            if dict_key is not None:
                if color_code not in color_mapping[color_name]:
                    color_mapping[color_name].append(color_code)
            else:
                color_mapping[color_name] = [color_code]

print(color_mapping)
