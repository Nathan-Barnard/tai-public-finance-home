import { Fragment } from 'react';

const TOKEN = /(Θ|m[IG]\b|A\(AᵀA\)⁻¹Aᵀe|a·\(e·a\)\/\(a·a\))/g;

/** Sets the few mathematical tokens in copy in the monospace face. */
export function MathInline({ text }: { text: string }) {
  const parts = text.split(TOKEN);
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <span key={index} className="t-math">
            {part === 'mI' ? (
              <>
                m<sub>I</sub>
              </>
            ) : part === 'mG' ? (
              <>
                m<sub>G</sub>
              </>
            ) : (
              part
            )}
          </span>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
