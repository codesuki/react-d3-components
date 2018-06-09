export const getPositionBySvgAndEvent = ({ svg, clientX, clientY, margin }) => {
    if (svg.createSVGPoint) {
        let point = svg.createSVGPoint();

        point.x = clientX;
        point.y = clientY;
        point = point.matrixTransform(svg.getScreenCTM().inverse());

        return [point.x - margin.left, point.y - margin.top];
    }

    const rect = svg.getBoundingClientRect();

    return [
        clientX - rect.left - svg.clientLeft - margin.left,
        clientY - rect.top - svg.clientTop - margin.left
    ];
};
