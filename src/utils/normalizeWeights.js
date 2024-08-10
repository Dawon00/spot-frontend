// 최소 최대 정규화 함수
function normalizeWeights(spots, minOutput = 1, maxOutput = 10) {
  const weights = spots.map((spot) => spot.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);

  return spots.map((spot) => {
    let normalizedWeight;
    if (maxWeight === minWeight) {
      normalizedWeight = (maxOutput + minOutput) / 2;
    } else {
      normalizedWeight =
        ((spot.weight - minWeight) / (maxWeight - minWeight)) *
          (maxOutput - minOutput) +
        minOutput;
    }

    return {
      ...spot,
      normalizedWeight: normalizedWeight,
    };
  });
}
