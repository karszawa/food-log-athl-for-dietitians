import React from "react";
import styled from "styled-components/native";
import dayjs from "dayjs";
import { Record } from "../lib/foolog-api-client-types";
import { AuthImage } from "./AuthImage";

interface Props {
  athleteId: string;
  record: Record;
}

export const RecordEntry = (props: Props) => {
  const { athleteId, record } = props;
  const photos = record.photos.map(photo => (
    <AuthPhoto key={photo.id} athleteId={athleteId} photo={photo} source={{}} />
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
  margin-top: 8px;
  margin-bottom: 8px;
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

const AuthPhoto = styled(AuthImage)`
  background-color: #eee;
  width: 80px;
  height: 80px;
  border-radius: 8px;
`;

const Photo = styled.Image`
  background-color: #eee;
  width: 80px;
  height: 80px;
  border-radius: 8px;
`;

const NoImagePhoto = () => <Photo source={require("../../assets/icon.png")} />;

const DateTimeText = styled.Text`
  color: #666;
  font-size: 14px;
`;

const FoodItem = styled.View`
  margin-top: 6px;
  flex-direction: row;
`;

const FoodItemName = styled.Text`
  flex: none;
  padding: 2px 12px;
  border-radius: 8px;
  background-color: #f5f5f5;
  color: #333;
  font-size: 16px;
  overflow: hidden;
`;
