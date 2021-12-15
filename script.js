window.addEventListener("load", function () {
  const mapObject = document.querySelector("#map");
  const svg = mapObject.contentDocument;
  const states = svg.querySelectorAll(".state");
  states.forEach((state, i) => {
    state.addEventListener("mouseenter", (event) => {
      document.querySelector("#region-name").textContent = state.id;
      document.querySelector("#region-area").textContent = calculateAreaOfPath(state.getAttribute('d').toString()) | 0;
      state.style.fill = 'red'
    });
  });
});
/**
 * Подсчёт площади полигона
 * @param {string} path 
 */
function calculateAreaOfPath(path) {
  const iterator = makeTrapezoidIterator(path)
  let area = 0
  let result = iterator.next()
  while (!result.done) {
    const [first, second] = result.value
    area += first[1] + second[1] * (second[0] - first[0]) / 2
    result = iterator.next()
  }
  return Math.abs(area)
}
/**
 * Итератор по трапециям
 * @param {string} path 
 */
function* makeTrapezoidIterator(path) {
  const arguments = path.split(' ')
  let buffer = []
  const points = []
  for (const argument of arguments) {
    if (['M', 'C', 'Z'].includes(argument)) {
      switch (buffer[0]) {
        case 'M': {
          const point = buffer[1].split(',').map(Number.parseFloat)
          points.push(point)
        }
          break
        case 'L': {
          const point = buffer[1].split(',').map(Number.parseFloat)
          points.push(point)
        }
          break
        case 'C': {
          const point = buffer[3].split(',').map(Number.parseFloat)
          points.push(point)
        }
          break;
        case 'Z': {
          const point = points[0]
          points.push(point)
        }
          break;
      }
      buffer = []
    }
    buffer.push(argument)
  }
  for (let i = 0; i < points.length; i++) {
    const nextIndex = i + 1 < points.length ? i + 1 : 0
    yield [points[i], points[nextIndex]]
  }
  return points.length + 1
}