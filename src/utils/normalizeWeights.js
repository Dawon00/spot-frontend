// 최소 최대 정규화 함수 (정수 값으로 반환)
export function normalizeWeights(spots, minOutput = 20, maxOutput = 60) {
  const weights = spots.map((spot) => spot.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);

  return spots.map((spot) => {
    let normalizedWeight;
    if (maxWeight === minWeight) {
      normalizedWeight = Math.round((maxOutput + minOutput) / 2);
    } else {
      normalizedWeight = Math.round(
        ((spot.weight - minWeight) / (maxWeight - minWeight)) *
        (maxOutput - minOutput) +
        minOutput
      );
    }

    return {
      ...spot,
      normalizedWeight: normalizedWeight,
    };
  });
}
