package main

import (
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"strconv"
)

func readCsvFile(filePath string) [][]string{
    f, err := os.Open(filePath)
    if err != nil {
        log.Fatal("Unable to read input file " + filePath, err)
    }
    defer f.Close()

    csvReader := csv.NewReader(f)
    records, err := csvReader.ReadAll()
    if err != nil {
        log.Fatal("Unable to parse file as CSV for " + filePath, err)
    }
    return records
}

func main() {
    records := readCsvFile("../quiz.csv");

    marks := 0;
    for i, _ := range records{
   	fmt.Println(fmt.Sprint("PROBLEM #", i, ":"), records[i][0])
     	var ans int
      	fmt.Print("ans: ")
     	fmt.Scan(&ans)
      	fmt.Println()

      	value, err := strconv.Atoi(records[i][1])

       if err != nil{
       		fmt.Println("error in converting from string to int");
         	return
       }

       if ans == value{
       		marks++
       }else{
       		//nothing
       }
    }

    fmt.Println(marks, "/", len(records))
}
