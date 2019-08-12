import { get } from "lodash-es";
import React, { useEffect } from "react";
import styled from "styled-components/native";
import { useDispatch, useSelector } from "react-redux";
import {
  CARBS_TAGNAME,
  // ENERC_KCAL_TAGNAME,
  FATS_TAGNAME,
  PROTEIN_TAGNAME,
} from "../constants";
import { Entry } from "../hooks/useEntry";
import { isRecord, Nutrient } from "../lib/foolog-api-client.d";
import { RootState } from "../store";
import { fetchNutritionAmount } from "../store/athlete/actions";

const KEYS = [
  // ["Energy", ENERC_KCAL_TAGNAME],
  ["Fats", FATS_TAGNAME],
  ["Carbs", CARBS_TAGNAME],
  ["Protein", PROTEIN_TAGNAME],
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

  console.log("45", nutritionTargets);

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
      {KEYS.map(([name, tagname]) => {
        const { id, value, unit } = nutrients[tagname];
        const targetAmount = get(nutritionTargets, `${id}.lower_bound`, 0);

        return (
          <NutrientItemContainer key={tagname}>
            <NutrientItemTitle>{name}</NutrientItemTitle>
            <NutrientItemValue>
              {Math.round(Number(value))} / {targetAmount}
              {unit}
            </NutrientItemValue>
          </NutrientItemContainer>
        );
      })}
    </NutrientSummaryContainer>
  );
};

const NutrientSummaryContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  background-color: white;
  border-radius: 8px;
  padding: 16px;
`;

const NutrientItemContainer = styled.View`
  flex-direction: column;
  justify-content: center;
`;

const NutrientItemTitle = styled.Text`
  margin-bottom: 16px;
  text-align: center;
  font-weight: bold;
`;

const NutrientItemValue = styled.Text`
  text-align: center;
`;
