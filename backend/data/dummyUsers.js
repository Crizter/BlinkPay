const dummyUsers = [
    {
      _id: "65fc1234abcd56789ef01234", // Fake MongoDB ObjectId
      name: "Aarav Gupta",
      email: "aarav@example.com",
      irisData: {
        leftIris: [
          { x: 0.42, y: 0.28 },
          { x: 0.43, y: 0.27 },
          { x: 0.41, y: 0.26 },
          { x: 0.42, y: 0.25 }
        ],
        rightIris: [
          { x: 0.58, y: 0.28 },
          { x: 0.59, y: 0.27 },
          { x: 0.57, y: 0.26 },
          { x: 0.58, y: 0.25 }
        ]
      },
      upiId: "aarav@ybl",
      balance: 5000,
    },
    {
      _id: "65fc5678abcd90123ef04567",
      name: "Priya Sharma",
      email: "priya@example.com",
      irisData: {
        leftIris: [
          { x: 0.40, y: 0.30 },
          { x: 0.41, y: 0.29 },
          { x: 0.39, y: 0.28 },
          { x: 0.40, y: 0.27 }
        ],
        rightIris: [
          { x: 0.60, y: 0.30 },
          { x: 0.61, y: 0.29 },
          { x: 0.59, y: 0.28 },
          { x: 0.60, y: 0.27 }
        ]
      },
      upiId: "priya@paytm",
      balance: 3000,
    }
  ];
  
  export default dummyUsers;
  