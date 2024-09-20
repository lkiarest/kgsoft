import { useEffect, useState } from "preact/hooks";

export default function() {
  const [wasm, setWasm] = useState(null)

  useEffect(() => {
    import("../wasm/img-compress/wasm_test").then(({ compress_with_resize }) => {
      setWasm({ compress_with_resize })
    })
  }, [])

  return [wasm]
}
