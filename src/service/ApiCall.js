import Axios from 'axios';
import ApiConstants from './ApiConstants.json';


export const apiCall = async (methodType, endPoint, body, queryParams) => {

  var response;

  try {
    switch (methodType) {
      case ApiConstants.methods.GET:
        response = await Axios.get(`${ApiConstants.baseUrl}${endPoint}`,
          // Axios.headers['Authorization'] = headers,
          // console.log("IN API CALL======================",headers),
          { params: queryParams });
        return response;

      case ApiConstants.methods.POST:
        response = await Axios.post(`${ApiConstants.baseUrl}${endPoint}`, body,
          // Axios.headers['Authorization'] = headers,
        );
        return response;

      case ApiConstants.methods.PUT:
        response = await Axios.put(`${ApiConstants.baseUrl}${endPoint}`, body, headers);
        return response
    }
  }
  catch (error) {
    console.log('Axios Error:', error.response.data)
    return error
  }
};