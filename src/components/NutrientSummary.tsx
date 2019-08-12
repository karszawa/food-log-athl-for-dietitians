import { get } from "lodash-es";
import React, { useEffect } from "react";
import styled from "styled-components/native";
import { useDispatch, useSelector } from "react-redux";
import { View } from "react-native";
import {
  CARBS_TAGNAME,
  ENERC_KCAL_TAGNAME,
  FATS_TAGNAME,
  PROTEIN_TAGNAME,
} from "../constants";
import { Entry } from "../hooks/useEntry";
import { isRecord, Nutrient } from "../lib/foolog-api-client.d";
import { RootState } from "../store";
import { fetchNutritionAmount } from "../store/athlete/actions";
import { PRIMARY_PINK, PRIMARY_ORANGE } from "../styles/color";

const KEYS = [
  // ["Energy", ENERC_KCAL_TAGNAME],
  ["Fats", FATS_TAGNAME, "#56AEB8"],
  ["Carbs", CARBS_TAGNAME, "#5FBA8F"],
  ["Protein", PROTEIN_TAGNAME, "#EC7053"],
];

interface Props {
  athleteId: string;
  entries: Entry[];
}

const useNutritionTargets = (athleteId: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchNutritionAmount({ athleteId }));
  }, []);

  const nutritionTargets = useSelector(
    (state: RootState) => state.athlete.nutritionTargets[athleteId]
  );

  return nutritionTargets;
};

export const NutrientSummary: React.FC<Props> = ({ athleteId, entries }) => {
  const nutritionTargets = useNutritionTargets(athleteId);

  const nutrients = entries.reduce(
    (nutrients, record) => {
      if (isRecord(record)) {
        record.nutrients.map(n => {
          nutrients[n.tagname] = {
            ...n,
            value: `${Number(n.value) +
              Number(get(nutrients[n.tagname], "value", 0))}`,
          };
        });
      }
      return nutrients;
    },
    {} as {
      [tagname: string]: Nutrient;
    }
  );

  if (Object.entries(nutrients).length === 0) {
    return null;
  }

  return (
    <NutrientSummaryContainer>
      <NutrientSummaryRow>
        {(() => {
          const name = "Energy";
          const tagname = ENERC_KCAL_TAGNAME;
          const { id, value, unit } = nutrients[tagname];
          const targetAmount = get(nutritionTargets, `${id}.lower_bound`, 0);

          return (
            <NutrientItemContainer style={{ flexDirection: "row" }}>
              <NutrientItemTitle>{name}</NutrientItemTitle>
              <NutrientItemBar
                actual={Number(value)}
                target={Number(targetAmount || value)}
                color={PRIMARY_ORANGE}
              />
              <NutrientItemValue>
                {Math.round(Number(value))}{" "}
                {targetAmount > 0 && `/ ${targetAmount}`}
                {unit}
              </NutrientItemValue>
            </NutrientItemContainer>
          );
        })()}
      </NutrientSummaryRow>
      <Separator />
      <NutrientSummaryRow last>
        {KEYS.map(([name, tagname, color]) => {
          const { id, value, unit } = nutrients[tagname];
          const targetAmount = get(nutritionTargets, `${id}.lower_bound`, 0);

          return (
            <NutrientItemContainer key={tagname}>
              <NutrientItemTitle>{name}</NutrientItemTitle>
              <NutrientItemBar
                actual={Number(value)}
                target={Number(targetAmount || value)}
                color={color}
              />
              <NutrientItemValue>
                {Math.round(Number(value))}{" "}
                {targetAmount > 0 && `/ ${targetAmount}`}
                {unit}
              </NutrientItemValue>
            </NutrientItemContainer>
          );
        })}
      </NutrientSummaryRow>
    </NutrientSummaryContainer>
  );
};

const NutrientSummaryContainer = styled.View`
  background-color: white;
  border-radius: 8px;
  padding: 16px;
`;

const NutrientSummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;

  margin-bottom: ${(props: { last?: boolean }) => (props.last ? 0 : 0)}px;
`;

const NutrientItemContainer = styled.View`
  flex-direction: column;
  justify-content: center;
  flex: 1;
  padding: 0 8px;
`;

const NutrientItemTitle = styled.Text`
  margin-bottom: 8px;
  text-align: center;
  font-weight: bold;
  flex: 1;
`;

const NutrientItemValue = styled.Text`
  text-align: center;
  flex: 1;
`;

const NutrientItemBar = ({
  actual,
  target,
  color,
}: {
  actual: number;
  target: number;
  color: string;
}) => {
  return (
    <NutrientItemBarContainer>
      <NutrientItemBarEntity
        width={Math.min((100.0 * actual) / target, 100)}
        color={color}
      />
    </NutrientItemBarContainer>
  );
};

const NutrientItemBarContainer = styled.View`
  border-radius: 8px;
  overflow: hidden;
  background-color: #eee;
  flex: 1;
  height: 12px;
  margin-bottom: 8px;
`;

interface NutrientItemBarEntityProps {
  width: number;
  color: string;
}

const NutrientItemBarEntity = styled.View`
  width: ${(props: NutrientItemBarEntityProps) => props.width}%;
  height: 100%;
  background-color: ${(props: NutrientItemBarEntityProps) => props.color};
`;

const Separator = styled.View`
  margin-bottom: 12px;
  flex: 1;
  border-top-width: 1px;
  border-top-color: #ddd;
`;
