import React from "react";

let Accordion = (props) => {
    return (
        <div className="accordion-item">
            <h2 className="accordion-header" id={"header_" + props.accHeadingId}>
                <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={"#" + props.targetAndControls}
                    aria-expanded="false"
                    aria-controls={"" + props.targetAndControls}
                >
                    {props.headContent}
                </button>
            </h2>
            <div
                id={"" + props.targetAndControls}
                className="accordion-collapse collapse"
                aria-labelledby={"" + props.accHeadingId}
                data-bs-parent={"#" + props.accId}
            >
                <div className={"accordion-body " + props.classes} align="center">
                    {props.children}
                </div>
            </div>
        </div>
    );
};

export default Accordion;
