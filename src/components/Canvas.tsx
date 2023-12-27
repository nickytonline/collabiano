import type { Lens } from "@snap/camera-kit/lib/generated-proto/pb_schema/camera_kit/v3/lens";
import { useEffect, useRef, useState } from "react";

interface CanvasProps {
  apiToken: string;
  defaultGroupKey: string;
}

type TransformType = any;
type PlaybackType = "live";
type CameraKitSession = any;

type MediaSource = {
  setTransform(transform: TransformType): void;
  setRenderSize(width: number, height: number): void;
};

const breakpoints = {
  xs: 640,
};

export const Canvas = ({ apiToken, defaultGroupKey }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lenses, setLenses] = useState<Lens[]>([]);
  const [sources, setSources] = useState<MediaSource[]>([]);
  const [cameraKitSession, setCameraKitSession] = useState<CameraKitSession>();
  let Transform2D;
  // Only a single Lens can be applied at a time, so calling `applyLens()` always replaces any existing Lens
  // with the new one -- that is, there's no need to call `removeLens()` first.
  const onApplyLens = async (lens: Lens) => {
    await cameraKitSession?.applyLens(lens);
  };

  const onSourceChange = async (source: MediaSource) => {
    if (!cameraKitSession) {
      alert("No cameraKitSession. Unable to continue.");
      return;
    }

    try {
      // The `source` here is a CameraKitSource, which can be created using a variety of helper methods
      // provided by Camera Kit. For example, to create a source for a `MediaStream`, use the
      // `createMediaStreamSource`.
      await cameraKitSession.setSource(source);

      // For webcams (our main use-case), it's natural to mirror the video -- this is easy to do with
      // Camera Kit!
      source.setTransform(Transform2D.MirrorX);

      // Here we're adjusting the render size to improve user experience on mobile devices. This shows
      // how render size can be set via the CameraKitSource.
      //
      // Keep in mind that setting render size *is not the same* as setting the size of the output on
      // the webpage. Camera Kit render size sets the resolution at which Lenses are rendered -- it has a
      // big impact on performance. When the CameraKitSession output <canvas> is added to the DOM, CSS can
      // (and should) be used to set the size of the <canvas> on the page.
      const shouldUsePortrait =
        parent.document.body.offsetWidth <= breakpoints.xs;
      if (shouldUsePortrait) {
        source.setRenderSize(480, 640);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }

    // Calling `play()` begins image processing. Now that we have a CameraKitSource attached to our
    // CameraKitSession, rendering will begin immediately -- without a Lens applied, this will simply
    // render the source to the output with no change (well, we are applying the MirrorX transformation, but
    // no other rendering happens without a Lens).
    //
    // Once a Lens is applied, we'll see the rendered Lens effect immediately now that we've already called
    // play().
    //
    // Note that we pass in "live" here -- this corresponds to the CameraKitSession.output.live <canvas>
    // element that we added to the DOM. ("live" is the default, but we've included it here for clarity.)
    //
    // CameraKitSession.pause() can be used to pause image processing, but we don't have a reason to do that
    // in this example.
    cameraKitSession.play("live");
  };

  // We'll use the canvas-output element as a placeholder in our HTML, replacing it here with the <canvas> output
  // from CameraKitSession -- in particular, we're using the `live` output, which renders the Lens's Live
  // RenderTarget.
  //
  // (For more on RenderTargets, see [the LensStudio documentation](https://docs.snap.com/lens-studio/references/guides/lens-features/scene-set-up/camera#live-target-and-capture-target))
  useEffect(() => {
    if (!cameraKitSession) {
      return;
    }

    canvasRef.current?.replaceWith(cameraKitSession.output.live);
  }, [canvasRef.current, cameraKitSession]);

  useEffect(() => {
    (async () => {
      const { bootstrapCameraKit, Transform2D: rawTransform2D } = await import(
        "@snap/camera-kit"
      );
      debugger;
      Transform2D = rawTransform2D;

      try {
        // The JSON_WEB_TOKEN can be found in the SnapKit Portal, where it's called the ApiToken.
        //
        // Bootstrapping Camera Kit downloads the WebAssembly executable which contains the rendering engine.
        const cameraKit = await bootstrapCameraKit({ apiToken });

        // Creating the session initializes the rendering engine, and creates a CameraKitSession instance. The
        // CameraKitSession is used to interact with the rendering engine -- for example, setting an input video source
        // and applying Lenses.
        const session = await cameraKit.createSession();
        setCameraKitSession(session);

        // When an error occurs, it means the current Lens could not be rendered. A real application will want to do
        // something more sophisticated here -- like asking the user to pick a different Lens, for example.
        session.events.addEventListener("error", (event) =>
          console.error(event.detail)
        );

        // We use the LensRepository to fetch a list of Lenses -- these are identified by a LensGroup ID. LensGroups
        // are configured in the Camera Kit Portal, where their IDs can be found.
        const { lenses } = await cameraKit.lensRepository.loadLensGroups([
          defaultGroupKey,
        ]);
        setLenses(lenses);

        // This section sets up the Camera Source <select> dropdown. It is populated with a list of video input devices
        // obtained from the browser, plus a Video and Image source.
        //
        // The most important parts are `session.setSource(source)` and `session.play('live')`, which have comments
        // below.
        //
      } catch (error: unknown) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className="grid gap-4 place-content-center">
      <h1>MultiSnap Fun</h1>
      <div className="flex gap-4">
        <label className="flex items-center">
          <span>Lens</span>
          <select name="lens" onChange={onApplyLens}>
            {lenses.map((lens) => (
              <option key={lens.id} value={lens.id}>
                {lens.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center">
          <span>Source</span>
          <select name="source" onChange={onSourceChange} />
        </label>
      </div>
      <canvas className="bg-black" ref={canvasRef} width="640" height="480" />
    </div>
  );
};
