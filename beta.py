import csv

global trackList
trackList = dict()
global trainList
trainList = dict()

class trackClass:
    def __init__(self, d,q,r,s,t,c,ad,u):
        self.type = c
        self.cat = ad
        self.name = d
        self.canCrossRoads = t
        self.maxSpeedLocalStation = float(u)
        self.baseTrackCost = int(q)
        self.baseStationCost = int(r)
        self.scissorsCrossoverCost = int(s)

class trainClass:
    def __init__(self, b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,aa,ab,ac,ad,ae,af,ag):
        self.id = b
        self.track_types = d.split(",")
        self.maxSpeed = float(f)
        self.maxAcceleration = float(g)
        self.maxDeceleration = float(h)
        self.capacityPerCar = int(i)
        self.minCars = int(j)
        self.maxCars = int(k)
        self.carsPerCarSet = int(l)
        self.carLength = float(m)
        self.trainWidth = float(n)
        self.minStationLength = self.carLength * self.maxCars
        self.maxStationLength = int(o)
        if self.maxStationLength < self.minStationLength:
            self.maxStationLength = self.minStationLength+10
            print("Your max station length for train "+self.id+" is impossible, (Min: " + self.minStationLength + "), corrected to: "+str(self.maxStationLength))
        elif self.maxStationLength == self.minStationLength:
            self.maxStationLength = self.minStationLength+5
        self.carCost = int(p)
        self.trainOperationalCostPerHour = int(w)
        self.carOperationalCostPerHour = int(x)
        self.color = y
        if not self.track_types[0] in trackList:
            trackList.update({self.track_types[0]:trackClass(self.track_types[0],q,r,s,t,c,ad,u)})
        self.track = trackList[self.track_types[0]]
        self.desc = e
        self.type = c
        self.mult = z.split("|")
        self.loc = [ae.split(", "),af.split(", "),ag.split(", ")]
        self.manufacturer = ac.split(",")
            
        

class config_maker:
    def one_type(j,train):
        j.write("\t\t\""+str(train.id)+"\": {\n")
        j.write("\t\t\t\"id\": \""+str(train.id)+"\",\n")
        j.write("\t\t\t\"name\": \""+str(train.id)+"\",\n")
        j.write("\t\t\t\"description\": \""+str(train.desc)+"\",\n")
        print(str(train.id)+": "+str(train.track.canCrossRoads).lower())
        j.write("\t\t\t\"allowAtGradeRoadCrossing\": "+str(train.track.canCrossRoads).lower()+",\n")
        j.write("\t\t\t\"stats\": {\n")
        j.write("\t\t\t\t\"maxAcceleration\": "+str(train.maxAcceleration)+",\n")
        j.write("\t\t\t\t\"maxDeceleration\": "+str(train.maxDeceleration)+",\n")
        j.write("\t\t\t\t\"maxSpeed\": "+str(train.maxSpeed)+",\n")
        j.write("\t\t\t\t\"maxSpeedLocalStation\": "+str(train.track.maxSpeedLocalStation)+",\n")
        j.write("\t\t\t\t\"capacityPerCar\": "+str(train.capacityPerCar)+",\n")
        j.write("\t\t\t\t\"carLength\": "+str(train.carLength)+",\n")
        j.write("\t\t\t\t\"minCars\": "+str(train.minCars)+",\n")
        j.write("\t\t\t\t\"maxCars\": "+str(train.maxCars)+",\n")
        j.write("\t\t\t\t\"carsPerCarSet\": "+str(train.carsPerCarSet)+",\n")
        j.write("\t\t\t\t\"carCost\": "+str(train.carCost)+",\n")
        j.write("\t\t\t\t\"trainWidth\": "+str(train.trainWidth)+",\n")
        j.write("\t\t\t\t\"minStationLength\": "+str(train.minStationLength)+",\n")
        j.write("\t\t\t\t\"maxStationLength\": "+str(train.maxStationLength)+",\n")
        j.write("\t\t\t\t\"baseTrackCost\": "+str(train.track.baseTrackCost)+",\n")
        j.write("\t\t\t\t\"baseStationCost\": "+str(train.track.baseStationCost)+",\n")
        j.write("\t\t\t\t\"trainOperationalCostPerHour\": "+str(train.trainOperationalCostPerHour)+",\n")
        j.write("\t\t\t\t\"carOperationalCostPerHour\": "+str(train.carOperationalCostPerHour)+",\n")
        j.write("\t\t\t\t\"scissorsCrossoverCost\": "+str(train.track.scissorsCrossoverCost)+",\n")
        j.write("\t\t\t},\n")
        j.write("\t\t\t\"elevationMultipliers\": {\n")
        j.write("\t\t\t\t\"DEEP_BORE\": "+str(train.mult[0])+",\n")
        j.write("\t\t\t\t\"STANDARD_TUNNEL\": "+str(train.mult[1])+",\n")
        j.write("\t\t\t\t\"CUT_AND_COVER\": "+str(train.mult[2])+",\n")
        j.write("\t\t\t\t\"AT_GRADE\": "+str(train.mult[3])+",\n")
        j.write("\t\t\t\t\"ELEVATED\": "+str(train.mult[4])+"\n")
        j.write("\t\t\t},\n")
        j.write("\t\t\t\"compatibleTrackTypes\": [\""+str(train.id)+"\", ")
        i = 0
        for c in train.track_types:
            i += 1
            j.write("\""+c)
            if i < len(train.track_types):
                j.write("\",")
            else:
                j.write("\"")
        j.write("],\n")
        j.write("\t\t\t\"appearance\": { \"color\": \""+str(train.color)+"\"},\n")
        j.write("\t\t\t\"isFixed\": false,\n")
        j.write("\t\t\t\"location\": {\n")
        j.write("\t\t\t\t\"city\": [")
        i = 0
        for c in train.loc[0]:
            i += 1
            j.write("\""+c)
            if i < len(train.loc[0]):
                j.write("\",")
            else:
                j.write("\"")
        j.write("],\n")
        j.write("\t\t\t\t\"country\": [")
        i = 0
        for c in train.loc[1]:
            i += 1
            j.write("\""+c)
            if i < len(train.loc[1]):
                j.write("\",")
            else:
                j.write("\"")
        j.write("],\n")
        j.write("\t\t\t\t\"continent\": [")
        i = 0
        for c in train.loc[2]:
            i += 1
            j.write("\""+c)
            if i < len(train.loc[2]):
                j.write("\",")
            else:
                j.write("\"")
        j.write("],\n")
        j.write("\t\t\t},\n")
        j.write("\t\t\t\"manufacturer\": [")
        i = 0
        for m in train.manufacturer:
            i += 1
            j.write("\""+m)
            if i < len(train.manufacturer):
                j.write("\",")
            else:
                j.write("\"")
        j.write("],\n")
        j.write("\t\t\t\"tag\": [\""+str(train.type)+"\"],\n")
        

    def run(self,tl):
        with open("index.js", "w") as j:
            j.write("(function() {\n\t'use strict';")
            j.write("\n\n\tconst TRAIN_DATA = {\n")
            c = 1
            for i in trainList.keys():
                self.one_type(j,tl[i])
                if c < len(tl.keys()):
                    j.write("\t\t},\n")
                    c += 1
                else:
                    j.write("\t\t}\n")
            j.write("\t};")
            j.write("\n\n\n\tfunction saveDataForAddTrains() {")
            j.write("\n\t\ttry {")
            j.write("\n\t\t\tconst storageKey = 'datapacktrains_data';")
            j.write("\n\t\t\tconst dataPackData = {")
            j.write("\n\t\t\t\ttrains: TRAIN_DATA,")
            j.write("\n\t\t\t\tmetadata: {")
            j.write("\n\t\t\t\t\tname: \"danTrains\",")
            j.write("\n\t\t\t\t\tversion: \"0.0.1\",")
            j.write("\n\t\t\t\t\ttrainCount: Object.keys(TRAIN_DATA).length,")
            j.write("\n\t\t\t\t\tlastUpdated: new Date().toISOString()")
            j.write("\n\t\t\t\t}\n\t\t\t};")
            j.write("\n\n\t\t\tlocalStorage.setItem(storageKey, JSON.stringify(dataPackData));")
            j.write("\n\t\t\tconsole.log(`[TrainDataPack] Saved ${Object.keys(TRAIN_DATA).length} trains`);")
            j.write("\n\n\t\t} catch (error) {")
            j.write("\n\t\t\tconsole.error('[TrainDataPack] Failed to save data:', error);")
            j.write("\n\t\t}\n\t}")
            j.write("\n\n\tsaveDataForAddTrains();\n\tconsole.log('[TrainDataPack] Data pack loaded successfully');")
            j.write("\n})();")

with open('trains.csv', encoding='utf-8', newline='') as csvfile:
    tracker = csv.reader(csvfile, delimiter=',', quotechar='\"')
    next(tracker)
    i = 0
    for row in tracker:
        i += 1
        print(i)
        print(row[0])
        if row[0] == "TRUE":
            hold = trainClass(row[1],row[2],row[3],row[4],row[5],row[6],row[7],row[8],row[9],row[10],row[11],row[12],row[13],row[14],row[15],row[16],row[17],row[18],row[19],row[20],row[21],row[22],row[23],row[24],row[25],row[26],row[27],row[28],row[29],row[30],row[31],row[32])
            trainList.update({str(row[1]):hold})

config_maker.run(config_maker,trainList)