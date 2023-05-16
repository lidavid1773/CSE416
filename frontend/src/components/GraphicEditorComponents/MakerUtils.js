import L from 'leaflet';
export const MARKER_TYPE = {
    IMAGE: "image",
    TEXT: "text",
}
export const createMarker = (option, markerStyle) => {
    const { map, e } = option
    const defaultOptions = { draggable: true };
    const markerOptions = { ...defaultOptions, ...markerStyle };
    const marker = L.marker(e.latlng, markerOptions).addTo(map);

    marker.on('dblclick', () => {
        marker.remove(); // Remove the marker on double-click
    });

    return marker;
};

export const addImageMarker = (option) => {
    const { image, polygon } = option;
    const icon = L.icon({
        iconUrl: image,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });
    const marker = createMarker(option, { icon });
    if (!polygon.imageMarkers) {
        polygon.imageMarkers = [];
    }
    polygon.imageMarkers.push(marker);
    return marker;

};

export const addTextIcon = (option) => {
    const { text, style } = option;
    const iconStyle = {
        className: 'text-marker',
        html: text,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    };
    const marker = createMarker(option, {
        icon: L.divIcon(iconStyle),
    });
    const textStyle = {
        color: 'red',
        fontSize: `${style.fontSize}px`,
        fontFamily: style.fontFamily
    }
    Object.assign(marker.getElement().style, textStyle);
    return marker;
};

export const addMarker = (option) => {
    let { markerType } = option;
    if (markerType === MARKER_TYPE.IMAGE) {
        return addImageMarker(option);
    }
    else if (markerType === MARKER_TYPE.TEXT) {
        return addTextIcon(option);
    }
};
