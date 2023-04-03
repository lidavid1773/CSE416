const IconCreator = (name,iconUrl,funct)=>{
  return {
    text:name,
    icon:iconUrl,
    callback:funct
  }
}
const funct =()=>{
  console.log("temp")
}
const EditName = IconCreator("Edit Name","https://cdn-icons-png.flaticon.com/512/1827/1827951.png",funct)
const ViewProperties=IconCreator("View Properties","https://cdn-icons-png.flaticon.com/512/4560/4560682.png",funct)
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

export const ContextMenu = [
  ViewProperties,
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
  undo
]