import L from "leaflet";
export const addButton = (buttonName, handleMethod,layer) => {
    L.Control.Button = L.Control.extend({
      options: {
        position: 'topleft'
      },
      onAdd: function (map) {
        var container = L.DomUtil.create('button', 'leaflet-bar leaflet-control');
        var button = L.DomUtil.create('a', 'leaflet-control-button', container);
        L.DomEvent.disableClickPropagation(button);
        L.DomEvent.on(container, 'click', function () {
          handleMethod()
        });
        const buttonElement = `<div >${buttonName}</div>`;
        container.innerHTML = buttonElement;
        return container;
      },
      onRemove: function (map) { },
    });
    var control = new L.Control.Button()
    control.addTo(layer);
  }
