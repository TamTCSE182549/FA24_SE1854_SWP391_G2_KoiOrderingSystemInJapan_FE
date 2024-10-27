import React, { useState } from "react";
import { Divider, Steps } from "antd";

const App = () => {
  const [currentHorizontal, setCurrentHorizontal] = useState(0);
  const [currentVertical, setCurrentVertical] = useState(0);

  const onChangeVertical = (value) => {
    setCurrentVertical(value);

    // Update horizontal step every 3rd vertical step
    setCurrentHorizontal(Math.floor(value / 3));
  };

  const description = "This is a description.";

  return (
    <>
      <div className="pb-10 pt-10 container mx-auto">
        <Steps
          current={currentHorizontal}
          onChange={setCurrentHorizontal}
          items={[
            {
              title: "Step 1",
              description: "Start",
            },
            {
              title: "Step 2",
              description,
            },
            {
              title: "Step 3",
              description,
            },
          ]}
        />

        <Divider />

        <Steps
          current={currentVertical}
          onChange={onChangeVertical}
          direction="vertical"
          items={[
            {
              title: "Step 1",
              description,
            },
            {
              title: "Step 2",
              description,
            },
            {
              title: "Step 3",
              description,
            },
            {
              title: "Step 4",
              description,
            },
            {
              title: "Step 5",
              description,
            },
            {
              title: "Step 6",
              description,
            },
            {
              title: "Step 7",
              description,
            },
          ]}
        />
      </div>
    </>
  );
};

export default App;
