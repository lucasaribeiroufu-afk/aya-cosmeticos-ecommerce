import * as React from "react"
import { cn } from "@/lib/utils"

const FALLBACK_IMAGE_URL =
  "https://static.wixstatic.com/media/12d367_4f26ccd17f8f4e3a8958306ea08c2332~mv2.png"

const Image = React.forwardRef(
  (
    {
      src,
      fittingType = "fill",
      originWidth,
      originHeight,
      className,
      style,
      alt = "",
      ...props
    },
    ref
  ) => {
    const [imgSrc, setImgSrc] = React.useState(src || FALLBACK_IMAGE_URL)

    React.useEffect(() => {
      setImgSrc(src || FALLBACK_IMAGE_URL)
    }, [src])

    const aspectRatio =
      originWidth && originHeight ? `${originWidth} / ${originHeight}` : undefined

    return (
      <img
        ref={ref}
        src={imgSrc}
        alt={alt}
        onError={() => setImgSrc(FALLBACK_IMAGE_URL)}
        className={cn(
          "w-full h-full",
          fittingType === "fit" ? "object-contain" : "object-cover",
          className
        )}
        style={{ aspectRatio, ...style }}
        loading="lazy"
        {...props}
      />
    )
  }
)

Image.displayName = "Image"

export { Image }
