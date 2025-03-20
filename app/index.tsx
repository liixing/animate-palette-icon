import { View } from "react-native";
import { SymbolView } from "expo-symbols";
import React from "react";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

export function withAnimated<Props extends object>(
  WrappedComponent: React.FC<Props>
) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";

  class WithAnimated extends React.Component<Props> {
    static displayName = `WithAnimated(${displayName})`;

    constructor(props: Props) {
      super(props);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return Animated.createAnimatedComponent<Props>(WithAnimated);
}

const AnimatedSymbolView = withAnimated(SymbolView);

export default function Index() {
  // 颜色动画进度
  const colorProgress = useSharedValue(0);

  const colors = [
    "#FF0000",
    "#FF7F00",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#4B0082",
    "#9400D3",
    "#FF0000",
  ];

  React.useEffect(() => {
    colorProgress.value = withRepeat(
      withTiming(1, { duration: 5000 }),
      -1, // -1 表示无限循环
      true // true 表示来回动画
    );
  }, []);

  const animatedProps = useAnimatedProps(() => {
    const mainColor = interpolateColor(
      colorProgress.value,
      [0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1],
      colors.slice(0, -1)
    );

    const bgColor = interpolateColor(
      colorProgress.value,
      [0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1],
      colors.slice(0, -1)
    );

    return {
      colors: [mainColor, bgColor],
    };
  });

  const otherAnimatedProps = useAnimatedProps(() => {
    return {
      tintColor: interpolateColor(
        colorProgress.value,
        [0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1],
        colors.slice(0, -1)
      ),
    };
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AnimatedSymbolView
        name="chevron.backward.circle.fill"
        type="palette"
        animatedProps={animatedProps}
        // colors={["#000", "#fff"]}
        size={100}
      />
      <AnimatedSymbolView
        name="chevron.backward.circle.fill"
        type="palette"
        animatedProps={otherAnimatedProps}
        size={100}
      />
    </View>
  );
}
