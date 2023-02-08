const FileSelector = ({ files, handleSetFiles }) => {
  return (
    <div>
      <div>Select a Shapefile</div>
      <input name="shapefile" type="file" onChange={handleSetFiles} />
      Shapefile selected: {files.shapefile || "None"}
      <br />
      <div>Select a dBASE file</div>
      <input name="dbase" type="file" onChange={handleSetFiles} />
      dBase file selected: {files.dbase || "None"}
    </div>
  );
};

export default FileSelector;
