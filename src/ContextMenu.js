import L from "leaflet";
const IconCreator = (name,iconUrl,funct)=>{
  return {
    text:name,
    icon:iconUrl,
    callback:funct
  }
}
const funct =(event)=>{
  console.log(event)
}
const funct1 =(event)=>{
  // console.log(layer)
  // console.log(properties)
  console.log(event)
}
const ViewProperties = (event) => {
  console.log(event)
  return event;
  // console.log(layer)
  // const container = L.DomUtil.create('div', 'props-container');
  // let propsTable = L.DomUtil.create('table', 'div', container);
  // const propsRow = propsTable.insertRow();
  // propsRow.insertCell().innerHTML = `<button class="add-props-btn">+add properties</button>`;
  // propsRow.addEventListener("click",()=>{
  //   const newRow = propsTable.insertRow(0);
  //   newRow.insertCell().innerHTML = `<input value="name:"></input>`;
  //   newRow.insertCell().innerHTML = `<input value="value"></input>`;
  // });
  // propsTable = L.DomUtil.create('table', 'props-table', container);
  // for (const key of Object.keys(properties)) {
  //   const propsRow = propsTable.insertRow();
  //   propsRow.insertCell().innerHTML = `<input value="${key}"></input>`;
  //   propsRow.insertCell().innerHTML = `<input value="${properties[key]}"></input>`;
  // }

  // L.DomEvent.on(layer, 'click', (event) => {
  //   L.DomEvent.preventDefault(event);
  //   layer.bindPopup(container, {
  //     className: 'popup-content'
  //   }).openPopup();
  // });
};
const EditName = IconCreator("Edit Name","https://cdn-icons-png.flaticon.com/512/1827/1827951.png",funct1)
const ViewEditPropertiesIcon=IconCreator("View Properties","https://cdn-icons-png.flaticon.com/512/4560/4560682.png",ViewProperties)
// regions operation
const SelectRegions=IconCreator("Select Regions","https://cdn-icons-png.flaticon.com/512/2767/2767163.png",funct)
const AddRegions=IconCreator("Add Regions","https://cdn-icons-png.flaticon.com/512/3161/3161837.png",funct)
const MergeRegions=IconCreator("Merge Regions","https://cdn-icons-png.flaticon.com/512/806/806549.png",funct)
const SpiltRegions=IconCreator("Split Regions","https://cdn-icons-png.flaticon.com/512/690/690339.png",funct)
const DeleteRegions=IconCreator("Delete Regions","https://cdn-icons-png.flaticon.com/512/6861/6861362.png",funct)
// vertices operation
const SelectVertices=IconCreator("Select Vertices","https://cdn-icons-png.flaticon.com/512/2767/2767163.png",funct)
const InsertVertices=IconCreator("Insert Vertices","https://cdn-icons-png.flaticon.com/512/359/359596.png",funct)
const DragVertices=IconCreator("Drag Vertices","https://cdn-icons-png.flaticon.com/512/9417/9417123.png",funct)
const DeleteVertices=IconCreator("Delete Vertices","https://cdn-icons-png.flaticon.com/512/6861/6861362.png",funct)
// redo undo
const redo=IconCreator("Redo","https://cdn-icons-png.flaticon.com/128/44/44650.png",funct)
const undo=IconCreator("Undo","https://cdn-icons-png.flaticon.com/128/44/44426.png",funct)


const icons = [
  { name: "Edit Name", url: "https://cdn-icons-png.flaticon.com/512/1827/1827951.png" },
  { name: "View Properties", url: "https://cdn-icons-png.flaticon.com/512/4560/4560682.png" },
  { name: "Select Regions", url: "https://cdn-icons-png.flaticon.com/512/2767/2767163.png" },
  { name: "Add Regions", url: "https://cdn-icons-png.flaticon.com/512/3161/3161837.png" },
  { name: "Merge Regions", url: "https://cdn-icons-png.flaticon.com/512/806/806549.png" },
  { name: "Split Regions", url: "https://cdn-icons-png.flaticon.com/512/690/690339.png" },
  { name: "Delete Regions", url: "https://cdn-icons-png.flaticon.com/512/6861/6861362.png" },
  { name: "Select Vertices", url: "https://cdn-icons-png.flaticon.com/512/2767/2767163.png" },
  { name: "Insert Vertices", url: "https://cdn-icons-png.flaticon.com/512/359/359596.png" },
  { name: "Drag Vertices", url: "https://cdn-icons-png.flaticon.com/512/9417/9417123.png" },
  { name: "Delete Vertices", url: "https://cdn-icons-png.flaticon.com/512/6861/6861362.png" },
  { name: "Redo", url: "https://cdn-icons-png.flaticon.com/128/44/44650.png" },
  { name: "Undo", url: "https://cdn-icons-png.flaticon.com/128/44/44426.png" },
];

export const ContextMenu = [
  ViewEditPropertiesIcon,
  EditName,
  {
    separator: true,
  },
  SelectRegions,
  AddRegions,
  MergeRegions,
  SpiltRegions,
  DeleteRegions,
  {
    separator: true,
  },
  SelectVertices,
  InsertVertices,
  DragVertices,
  DeleteVertices,
  {
    separator: true,
  },
  redo,
  undo,
]