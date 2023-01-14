import { useContext, useEffect } from "react";
// @ts-ignore TODO: typings
import Quagga from "quagga";
import './style.css';
import { Context } from "../../App";

interface Point {
  x: number;
  y: number;
}
type PointArray = [x: number, y: number];

interface CodeInfo {
  error?: number;
  code: number;
  start: number;
  end: number;
}

interface Done {
  angle: number;
  box: [PointArray, PointArray, PointArray, PointArray];
  boxes: Array<[PointArray, PointArray, PointArray, PointArray]>;
  line: [start: Point, end: Point];
  pattern: Array<1 | 0>;
  codeResult: {
    code: string;
    codeset: string | number;
    direction: 1 | -1;
    end: number;
    start: number;
    decodedCodes: Array<CodeInfo>;
    format:
      | "ean_13"
      | "code_39"
      | "codabar"
      | "ean_8"
      | "upc_a"
      | "upc_e"
      | "code_128";
    startInfo: CodeInfo;
    endInfo: CodeInfo;
  };
}

export default function BarcodeScanner() {
  const { setSearchQuery } = useContext(Context);

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          constraints: {
            width: 800,
            height: 600,
            facingMode: "environment",
          },
          target: document.querySelector("#yourElement"), // Or '#yourElement' (optional)
        },
        locator: {
          halfSample: true,
          patchSize: "medium",
        },
        numOfWorkers: 4,
        decoder: {
          readers: ["ean_reader"],
        },
        locate: true,
      },
      function (err: Error) {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();

        Quagga.onDetected((data: Done) => {
          Quagga.stop();
          console.log(data.codeResult.code);
          setSearchQuery(data.codeResult.code);
        });

        Quagga.onProcessed((result: any) => {
          var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

          if (result) {
            if (result.boxes) {
              drawingCtx.clearRect(
                0,
                0,
                parseInt(drawingCanvas.getAttribute("width")),
                parseInt(drawingCanvas.getAttribute("height"))
              );
              result.boxes
                .filter(function (box: any) {
                  return box !== result.box;
                })
                .forEach(function (box: any) {
                  Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                    color: "green",
                    lineWidth: 2,
                  });
                });
            }

            if (result.box) {
              Quagga.ImageDebug.drawPath(
                result.box,
                { x: 0, y: 1 },
                drawingCtx,
                { color: "#00F", lineWidth: 2 }
              );
            }

            if (result.codeResult && result.codeResult.code) {
              Quagga.ImageDebug.drawPath(
                result.line,
                { x: "x", y: "y" },
                drawingCtx,
                { color: "red", lineWidth: 3 }
              );
            }
          }
        });
      }
    );

    // TODO: fix camera stop on unmount
    return () => {
      console.log('stop');
      Quagga.stop();
    }
  }, []);

  return <div id="yourElement"></div>;
}
