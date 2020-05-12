import axios from 'axios';

const baseUrl = 'http://api.openweathermap.org/data/2.5';
const appid = '099a7c33c1be08ed21d565feaedb1fd4';

export const fetchCityJson = () => {
    return axios.get('./current.city.list.json');
}

export const fetchWeatherByCityId = (id) => {
    return axios.get(`${baseUrl}/forecast?id=${id}&appid=${appid}`)
}