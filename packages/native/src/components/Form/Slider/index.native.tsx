import React, { useCallback } from "react";
import RnRangeSlider from "rn-range-slider";
import Text from "@components/Text";

export type SliderProps = {
  step: number;
  min: number;
  max: number;
  value: number;
  onChange: (low: number, high: number) => void;
  disabled?: boolean;
};

import styled from "styled-components/native";
import {
  Label,
  MinMaxTextContainer,
  Notch,
  Rail,
  RailSelected,
  Thumb,
} from "@components/Form/Slider/components";

const SliderContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Slider = ({ value, min, max, step, onChange, disabled }: SliderProps) => {
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback((value) => <Label>{value}</Label>, []);
  const renderNotch = useCallback(() => <Notch />, []);

  return (
    <SliderContainer>
      <RnRangeSlider
        style={{
          width: "100%",
        }}
        min={min}
        max={max}
        low={value}
        disabled={disabled}
        step={step}
        disableRange={true}
        floatingLabel={true}
        renderThumb={Thumb}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
        renderLabel={renderLabel}
        renderNotch={renderNotch}
        onValueChanged={onChange}
      />
      <MinMaxTextContainer>
        <Text
          type={"small"}
          fontWeight={"medium"}
          color={"palette.neutral.c70"}
        >
          {min}
        </Text>
        <Text
          type={"small"}
          fontWeight={"medium"}
          color={"palette.neutral.c70"}
        >
          {max}
        </Text>
      </MinMaxTextContainer>
    </SliderContainer>
  );
};

export default Slider;
