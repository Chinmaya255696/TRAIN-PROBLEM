
function processTrainJourney(inputData) {
    const trainAStn = [
        {"station_id": "CHN", "distance": 0},
        {"station_id": "SLM", "distance": 350},
        {"station_id": "BLR", "distance": 550},
        {"station_id": "KRN", "distance": 900},
        {"station_id": "HYB", "distance": 1200},
        {"station_id": "NGP", "distance": 1600},
        {"station_id": "ITJ", "distance": 1900},
        {"station_id": "BPL", "distance": 2000},
        {"station_id": "AGA", "distance": 2500},
        {"station_id": "NDL", "distance": 2700}
    ];

    const trainBStn = [
        {"station_id": "TVC", "distance": 0},
        {"station_id": "SRR", "distance": 300},
        {"station_id": "MAQ", "distance": 600},
        {"station_id": "MAO", "distance": 1000},
        {"station_id": "PNE", "distance": 1400},
        {"station_id": "HYB", "distance": 2000},
        {"station_id": "NGP", "distance": 2400},
        {"station_id": "ITJ", "distance": 2700},
        {"station_id": "BPL", "distance": 2800},
        {"station_id": "PTA", "distance": 3800},
        {"station_id": "NJP", "distance": 4200},
        {"station_id": "GHY", "distance": 4700}
    ];

    function parseInput(inputData) {
        const trainA = inputData.TRAIN_A.split(' ');
        const trainB = inputData.TRAIN_B.split(' ');

        const trainAData = {
            engine: trainA[1],
            bogies: trainA.slice(2),
        };

        const trainBData = {
            engine: trainB[1],
            bogies: trainB.slice(2),
        };

        return { TRAIN_A: trainAData, TRAIN_B: trainBData };
    }

    const parsedInput = parseInput(inputData);

    const processTrain = (trainData, trainStn, otherTrainStn) => {
        const bogies = trainData.bogies;

        const matchedStations = bogies.filter(bogie => trainStn.some(station => station.station_id === bogie));

        const unmatchedStations = bogies.filter(bogie => {
            const matchedInTrain = trainStn.some(station => station.station_id === bogie);
            if (!matchedInTrain) {
                const matchedInOtherTrain = otherTrainStn.some(station => station.station_id === bogie);
                if (matchedInOtherTrain) {
                    const bogieDistance = otherTrainStn.find(station => station.station_id === bogie).distance;
                    const hybDistance = trainStn.find(station => station.station_id === "HYB").distance;
                    return bogieDistance >= hybDistance;
                }
            }
            return false;
        });

        const hybDistance = trainStn.find(station => station.station_id === "HYB").distance;
        const remainingMatchedStations = matchedStations.filter(station => {
            const matchedStationDistance = trainStn.find(s => s.station_id === station).distance;
            return matchedStationDistance >= hybDistance;
        });

        const finalResult = remainingMatchedStations.concat(unmatchedStations);

        return finalResult;
    };

    const finalResultOfTrainA = processTrain(parsedInput.TRAIN_A, trainAStn, trainBStn);
    const finalResultOfTrainB = processTrain(parsedInput.TRAIN_B, trainBStn, trainAStn);

    const mergedBogies = [...finalResultOfTrainA, ...finalResultOfTrainB];
    mergedBogies.sort((a, b) => {
        const distanceA = Math.max(trainAStn.find(stn => stn.station_id === a)?.distance || 0, trainBStn.find(stn => stn.station_id === a)?.distance || 0);
        const distanceB = Math.max(trainAStn.find(stn => stn.station_id === b)?.distance || 0, trainBStn.find(stn => stn.station_id === b)?.distance || 0);
        return distanceB - distanceA;
    });

    const departureBogies = mergedBogies.filter(bogie => bogie !== 'HYB');

    const arrivalMessageTrainA = finalResultOfTrainA.length === 0
        ? "YOUR_JOURNEY_TRAIN_A_ENDED_HERE"
        : `ARRIVAL TRAIN_A ${parsedInput.TRAIN_A.engine} ${finalResultOfTrainA.join(' ')}`;

    const arrivalMessageTrainB = finalResultOfTrainB.length === 0
        ? "YOUR_JOURNEY_TRAIN_B_ENDED_HERE"
        : `ARRIVAL TRAIN_B ${parsedInput.TRAIN_B.engine} ${finalResultOfTrainB.join(' ')}`;

    const departureMessage = `DEPARTURE TRAIN_AB  ${parsedInput.TRAIN_A.engine} ${parsedInput.TRAIN_B.engine} ${departureBogies.join(' ')}`;

    return {
        arrivalMessageTrainA,
        arrivalMessageTrainB,
        departureMessage
    };
}

const inputData = {
    TRAIN_A: 'TRAIN_A ENGINE SLM BLR KRN HYB SLM NGP ITJ',
    TRAIN_B: 'TRAIN_B ENGINE SRR MAO NJP PNE PTA',
};

//OUTPUT===>
//ARRIVAL TRAIN_A ENGINE HYB NGP ITJ
// ARRIVAL TRAIN_B ENGINE NJP PTA
// DEPARTURE TRAIN_AB  ENGINE ENGINE NJP PTA ITJ NGP


// const inputData = {
// TRAIN_A: 'TRAIN_A ENGINE NDL NDL KRN GHY SLM NJP NGP BLR',
// TRAIN_B: 'TRAIN_B ENGINE NJP GHY AGA PNE MAO BPL PTA',
// };

//OUTPUT=>
// ARRIVAL TRAIN_A ENGINE NDL NDL NGP GHY NJP
// ARRIVAL TRAIN_B ENGINE NJP GHY BPL PTA AGA
// DEPARTURE TRAIN_AB  ENGINE ENGINE GHY GHY NJP NJP PTA BPL NDL NDL AGA NGP

const result = processTrainJourney(inputData);
console.log(result.arrivalMessageTrainA);
console.log(result.arrivalMessageTrainB);
console.log(result.departureMessage);
