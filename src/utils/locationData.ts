import Papa from 'papaparse';

interface LocationData {
  stateCode: string;
  stateName: string;
  districtCode: string;
  districtName: string;
  subDistrictCode: string;
  subDistrictName: string;
  townCode: string;
  areaName: string;
}

let locationData: LocationData[] = [];

export const loadLocationData = async () => {
  try {
    const response = await fetch('/India_states.csv');
    const csvText = await response.text();
    
    Papa.parse(csvText, {
      header: true,
      complete: (results) => {
        locationData = results.data.map((row: any) => ({
          stateCode: row['ST.Code'],
          stateName: row['STATE.NAME'],
          districtCode: row['DT.Code'],
          districtName: row['DISTRICT.NAME'],
          subDistrictCode: row['SDT.Code'],
          subDistrictName: row['SUB.DISTRICT.NAME'],
          townCode: row['Town.Code'],
          areaName: row['Area.Name']
        }));
      }
    });
  } catch (error) {
    console.error('Error loading location data:', error);
  }
};

export const getStates = () => {
  const states = new Set(locationData.map(item => item.stateName));
  return Array.from(states).sort();
};

export const getDistricts = (stateName: string) => {
  const districts = new Set(
    locationData
      .filter(item => item.stateName === stateName && item.districtName !== stateName)
      .map(item => item.districtName)
  );
  return Array.from(districts).sort();
};

export const getSubDistricts = (stateName: string, districtName: string) => {
  const subDistricts = new Set(
    locationData
      .filter(
        item => 
          item.stateName === stateName && 
          item.districtName === districtName && 
          item.subDistrictName !== districtName
      )
      .map(item => item.subDistrictName)
  );
  return Array.from(subDistricts).sort();
};

export const getAreas = (stateName: string, districtName: string, subDistrictName: string) => {
  const areas = new Set(
    locationData
      .filter(
        item => 
          item.stateName === stateName && 
          item.districtName === districtName && 
          item.subDistrictName === subDistrictName
      )
      .map(item => item.areaName)
  );
  return Array.from(areas).sort();
}; 