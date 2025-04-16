import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@/components/ui/slider';
interface SliderProps {
  maxValue: number;
  setSliderValue: React.Dispatch<React.SetStateAction<number>>;
  sliderValue: number;
}

const SliderWithArrow: React.FC<SliderProps> = ({ maxValue, setSliderValue, sliderValue }) => {
  return (
    <Slider
      className="w-full bg-red-400"
      defaultValue={sliderValue}
      minValue={1}
      maxValue={maxValue}
      step={1}
      size="md"
      orientation="horizontal"
      isDisabled={false}
      isReversed={false}
      onChange={(value) => setSliderValue(value)}>
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb shape="triangle" />
    </Slider>
  );
};

export default SliderWithArrow;
