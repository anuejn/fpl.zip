import React, {useState, useEffect} from "react";

export function useSelection() {
  const [selection, setSelection] = useState(null)
  useEffect(() => {
    document.onselectionchange = () => {
      const selection = document.getSelection();
      if (selection.type === "Range") {
        setSelection(selection.getRangeAt(0))
      } else {
        setSelection(null)
      }
    }
  })
  return selection;
}