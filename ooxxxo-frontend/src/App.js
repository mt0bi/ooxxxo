import React, { useRef, useState, Fragment } from "react"
import { applyProps, Canvas, useFrame, useThree } from "react-three-fiber"
import "./App.css"

function Field(props) {
  const { camera } = useThree()
  const mesh = useRef()
  if (props.mark === "x") {
    camera.position.setX(props.row)
    camera.position.setY(props.column)
  }

  const [hovered, setHover] = useState(false)

  return (
    <mesh
      {...props}
      ref={mesh}
      // onClick={(e) => setActive(!active)}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}>
      <planeGeometry attach="geometry" />
      <meshStandardMaterial
        attach="material"
        color={hovered ? "hotpink" : "black"}
      />
      <Piece mark={props.mark} />
    </mesh>
  )
}

function Piece(props) {
  const mesh = useRef()

  let color = ""

  switch (props.mark) {
    case "x":
      color = "blue"
      break
    case "o":
      color = "red"
      break
    default:
      color = "gray"
  }

  return props.mark === "-" ? null : (
    <mesh scale={[0.2, 0.2, 0.2]}>
      <sphereGeometry attach="geometry" scale={[2, 2, 2]} />
      <meshStandardMaterial attach="material" color={color} />)
    </mesh>
  )
}

function GameBoard(props) {
  const { boardSize, ...restProps } = props
  const matrix = new Array(boardSize)
    .fill("-")
    .map(() => new Array(boardSize).fill("-"))
  const [gameBoard, updateGameBoard] = useState(matrix)

  const fields = []

  for (let i = 0; i < boardSize; i += 1) {
    for (let j = 0; j < boardSize; j += 1) {
      fields.push(
        <Field
          key={i.toString() + "-" + j.toString()}
          row={i}
          column={j}
          position={[i, j, -5]}
          mark={gameBoard[i][j]}></Field>
      )
    }

    return fields
  }
}

function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    if (hovered && !active) {
      mesh.current.rotation.z += 0.01
      mesh.current.rotation.x += 0.01
    }
    if (hovered && active) {
      mesh.current.rotation.y += 0.02
      mesh.current.rotation.x += 0.06
    }
  })

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(e) => setActive(!active)}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial
        attach="material"
        color={hovered ? "hotpink" : "orange"}
      />
    </mesh>
  )
}

function App() {
  const BOARD_SIZE = 5

  const [turn, setTurn] = useState("x")

  return (
    <Fragment>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <GameBoard boardSize={BOARD_SIZE} />
      </Canvas>
    </Fragment>
  )
}

export default App
