import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAddText, setAddTextState } from '../../features/GraphicEditorDropdown/graphicEditordropdownSlice';
export default function AddText() {
  const graphicEditor = useSelector(state => state.graphicEditor);
  const dispatch = useDispatch();
  const { addTextState,addText } = graphicEditor;
  const toggleHighlight = () => {
    dispatch(setAddTextState(!addTextState))
  };
  const handleTextInput = (e)=>{
    dispatch(setAddText(e.target.value))
  }
  const buttonStyle = {
    border: addTextState ? '2px solid blue' : '1px solid black',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button onClick={toggleHighlight} style={{ marginRight: '10px', padding: '5px',...buttonStyle }}>
        Add Text
      </button>
      {addTextState && <input type="text" value={addText} onChange={(e) => handleTextInput (e) } style={{ padding: '5px' }} />}
    </div>

  );
}
