import React from "react";
import styled from "styled-components/native";
import dayjs from "dayjs";
import { Record } from "../lib/foolog-api-client.d";

interface Props {
  record: Record;
}

export const RecordEntry = (props: Props) => {
  const { record } = props;
  const photos = record.photos.map(photo => (
    <Photo key={photo.id} source={{ uri: photo.file.url }} />
  ));
  const datetime = dayjs(record.datetime).format("YYYY年M月D日 h:mm");
  const foodItems = record.food_items.map(foodItem => (
    <FoodItem key={foodItem.id}>
      <FoodItemName>
        {foodItem.name} {foodItem.unit.replace(/\?/, foodItem.qty)}
      </FoodItemName>
    </FoodItem>
  ));

  return (
    <Container>
      <ThumbnailContainer>
        {record.photos.length > 0 ? photos : <NoImagePhoto />}
      </ThumbnailContainer>

      <DetailContainer>
        <DateTimeContainer>
          <DateTimeText>{datetime}</DateTimeText>
        </DateTimeContainer>
        <FoodItemsContainer>{foodItems}</FoodItemsContainer>
      </DetailContainer>
    </Container>
  );
};

const Container = styled.View`
  border-radius: 8px;
  background-color: white;
  flex-direction: row;
  flex: 1;
`;

const ThumbnailContainer = styled.View`
  padding: 8px;
`;

const DetailContainer = styled.View`
  padding: 8px;
  flex: 1;
`;

const DateTimeContainer = styled.View``;

const FoodItemsContainer = styled.View``;

const Photo = styled.Image`
  background-color: #eee;
  width: 80px;
  height: 80px;
  border-radius: 8px;
`;

const NoImagePhoto = () => <Photo source={require("../../assets/icon.png")} />;

const DateTimeText = styled.Text`
  color: #666;
  font-size: 16px;
`;

const FoodItem = styled.View`
  margin-top: 6px;
  border-radius: 8px;
  background-color: #eee;
  padding: 2px 12px;
  flex: 0;
`;

const FoodItemName = styled.Text`
  color: #333;
  font-size: 16px;
  flex: 0;
`;
