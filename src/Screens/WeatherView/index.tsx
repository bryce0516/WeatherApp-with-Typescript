import React, { useEffect, useState } from 'react'
import { FlatList, Alert } from 'react-native'
import Styled, { ThemeConsumer } from 'styled-components'
import Geolocation from '@react-native-community/geolocation';

const Container = Styled.View`
  flex: 1;
  background-color: #EEE;
`;

const WeatherContainer = Styled(FlatList)``;

const LoadingView = Styled.View`
  flex:1;
  justify-content: center;
  align-items: center;
`;

const Loading = Styled.ActivityIndicator`
  margin-bottom: 16px;
`;

const LoadingLabel = Styled.Text`
  font-size: 16px;
`;

const WeatherItemContainer = Styled.View`
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const Weather = Styled.Text`
  margin-bottom: 16px;
  font-size: 24px;
  font-weight: bold;
`;

const Temperature = Styled.Text`
  font-size: 16px;
`;


// const API_KEY = "b4f1fb519f03620253219c96e8afc3cc"
interface Props {
    
}
interface IWeather {
  temperature? : number;
  weather? : string;
  isLoading: boolean;
}

const WeatherView = ({}:Props) => {
  const [weatherInfo, setWeatherInfo] = useState<IWeather>({
    temperature: undefined,
    weather: undefined,
    isLoading: false,
  })

  const getCurrentWeather = () => {
    console.log('pass here')
    setWeatherInfo({
      isLoading: false
    });
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('Geolocation.getCurrentPosition',position.coords.latitude,position.coords.longitude)
        const {latitude, longitude } = position.coords;
        const address = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
        fetch(address)
          .then(response => 
            response.json()
          )
          .then(json => {
            console.log("weather json", json)
            setWeatherInfo({
              temperature: json.main.temp,
              weather: json.weather[0].main,
              isLoading: true
            })
          })
          .catch(error => {
            setWeatherInfo({
              isLoading: true,
            })
            showError('날씨정보를 가져오는데 실패하였습니다.')
          })
      },
      (error) => {
        setWeatherInfo({
          isLoading: true,
        });
        showError('위치정보를 가져오는데 실패하였습니다.')
      }
    )
  }
  const showError = (message:string): void =>{
    setTimeout(() => {
      Alert.alert(message)
    }, 500);
  }
  
  useEffect(() => {
    getCurrentWeather()
  }, []);

  let data = [];
  const { isLoading, weather, temperature } = weatherInfo;
  if(weather && temperature) {
    data.push(weatherInfo);
  }

  return (  
  <Container>
    <WeatherContainer 
      onRefresh={() => getCurrentWeather()}
      refreshing={!isLoading}
      data={data}
      keyExtractor={(item, index) => {
        return `Weather-${index}`;
      }}
      ListEmptyComponent={
        <LoadingView>
          <Loading size="large" color="#1976D2"/>
          <LoadingLabel>Loading...</LoadingLabel>
        </LoadingView>
      }
      renderItem={({item, index}) => (
        <WeatherItemContainer>
          <Weather>{(item as IWeather).weather}</Weather>
          <Temperature>({(item as IWeather).temperature}C)</Temperature>
        </WeatherItemContainer>
      )}
      contentContainerStyle={{flex:1}}
    />
  </Container>
  );
}
 
export default WeatherView;