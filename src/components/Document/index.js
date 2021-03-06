// @flow

import React, { useState } from "react"
import type { SequenceItem } from "../../types"
import { makeStyles } from "@material-ui/styles"
import stringToSequence from "../../string-to-sequence.js"
import Tooltip from "@material-ui/core/Tooltip"

const useStyles = makeStyles({})

type Props = {
  sequence: Array<SequenceItem>,
  canModifySequence?: boolean,
  onSequenceChange?: (Array<SequenceItem>) => any,
  onHighlightedChanged?: (Array<number>) => any,
  nothingHighlighted?: boolean,
  colorLabelMap?: Object
}

export default function Document({
  sequence,
  onHighlightedChanged = () => null,
  onSequenceChange = () => null,
  nothingHighlighted = false,
  colorLabelMap = {}
}: Props) {
  const [mouseDown, changeMouseDown] = useState()
  const [
    [firstSelected, lastSelected],
    changeHighlightedRangeState
  ] = useState([null, null])
  const changeHighlightedRange = ([first, last]) => {
    changeHighlightedRangeState([first, last])
    const highlightedItems = []
    for (let i = Math.min(first, last); i <= Math.max(first, last); i++)
      highlightedItems.push(i)
    onHighlightedChanged(highlightedItems)
  }
  let highlightedItems = []
  if (!nothingHighlighted && firstSelected !== null && lastSelected !== null) {
    for (
      let i = Math.min(firstSelected, lastSelected);
      i <= Math.max(firstSelected, lastSelected);
      i++
    )
      highlightedItems.push(i)
  }

  return (
    <div
      onMouseDown={() => changeMouseDown(true)}
      onMouseUp={() => changeMouseDown(false)}
    >
      {sequence.map((seq, i) => (
        <span
          key={i}
          onMouseDown={() => {
            if (seq.label) return
            changeHighlightedRange([i, i])
          }}
          onMouseMove={() => {
            if (seq.label) return
            if (mouseDown && i !== lastSelected) {
              changeHighlightedRange([
                firstSelected === null ? i : firstSelected,
                i
              ])
            }
          }}
          style={
            seq.label
              ? {
                  display: "inline-flex",
                  backgroundColor:
                    seq.color || colorLabelMap[seq.label] || "#333",
                  color: "#fff",
                  padding: 4,
                  margin: 4,
                  paddingLeft: 10,
                  paddingRight: 10,
                  borderRadius: 4,
                  userSelect: "none"
                }
              : {
                  display: "inline-flex",
                  backgroundColor:
                    seq.text !== " " && highlightedItems.includes(i)
                      ? "#ccc"
                      : "inherit",
                  color: "#333",
                  marginTop: 4,
                  marginBottom: 4,
                  paddingTop: 4,
                  paddingBottom: 4,
                  paddingLeft: 2,
                  paddingRight: 2,
                  userSelect: "none"
                }
          }
          key={i}
        >
          {seq.label ? (
            <Tooltip title={seq.label} placement="bottom">
              <div>{seq.text}</div>
            </Tooltip>
          ) : (
            <div>{seq.text}</div>
          )}
          {seq.label && (
            <div
              onClick={() => {
                onSequenceChange(
                  sequence
                    .flatMap(s => (s !== seq ? s : stringToSequence(s.text)))
                    .filter(s => s.text.length > 0)
                )
              }}
              style={{
                display: "inline-flex",
                cursor: "pointer",
                alignSelf: "center",
                fontSize: 11,
                width: 18,
                height: 18,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 4,
                borderRadius: 9,
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.2)"
              }}
            >
              <span>{"\u2716"}</span>
            </div>
          )}
        </span>
      ))}
    </div>
  )
}
