import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import {
  ScoreTableData,
  ScoreTableFilter,
  ScoreTablePagination,
} from '../../model/score.model';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  constructor() {}

  getFullTableData(): ScoreTableData[] {
    const encodedFullData =
      localStorage?.getItem('score-table-full-data') ?? '';
    if (encodedFullData) {
      return JSON.parse(window.atob(encodedFullData));
    } else {
      const tableData = dummyData;
      localStorage?.setItem(
        'score-table-full-data',
        window.btoa(JSON.stringify(tableData))
      );
      return tableData;
    }
  }

  filterTableData(
    data: ScoreTableData[],
    filter: ScoreTableFilter
  ): ScoreTableData[] {
    let filteredData = [...data];
    if (filter?.name) {
      filteredData = filteredData.filter((score) =>
        score?.name?.toLowerCase().startsWith(filter?.name?.toLowerCase() ?? '')
      );
    }
    if (filter?.course) {
      filteredData = filteredData.filter((score) =>
        score?.course?.toLowerCase().startsWith(filter?.course?.toLowerCase() ?? '')
      );
    }

    if (filter?.score) {
      filteredData = filteredData.filter(
        (score) => score?.score?.toLowerCase().startsWith(filter?.score?.toLowerCase() ?? ''));
    }

    filteredData = this.updateCountDocument(filteredData);

    return filteredData;
  }

  paginateTableData(
    data: ScoreTableData[],
    pagination: ScoreTablePagination
  ): ScoreTableData[] {
    const startIndex = (pagination.page - 1) * pagination.amount;
    const endIndex = startIndex + pagination.amount;

    if (pagination.page === Math.ceil(data.length / pagination.amount)) {
      return data.slice(startIndex);
    }

    return data.slice(startIndex, endIndex);
  }



  fetchScoreData(
    filter: ScoreTableFilter,
    pagination: ScoreTablePagination
  ): Observable<ScoreTableData[]> {
    const fullTableData = this.getFullTableData();

    return of(fullTableData).pipe(
      map((data) => {
        const filteredData = this.filterTableData(data, filter);
        const paginatedData = this.paginateTableData(filteredData, pagination);

        localStorage.setItem(
          'score-table-pagination',
          JSON.stringify(pagination)
        );
        localStorage.setItem('score-table-filter', JSON.stringify(filter));

        return paginatedData;
      })
    );
  }

  addScore(newData: ScoreTableData): void {
    const fullTableData = this.getFullTableData();
    const newId =
      fullTableData.length > 0
        ? Math.max(...fullTableData.map((item) => item._id)) + 1
        : 1;
    newData._id = newId;
    newData.student_id = generateRandomStudentId(newId);

    fullTableData.push(newData);

    const tableData = this.updateCountDocument(fullTableData);

    localStorage.setItem(
      'score-table-full-data',
      window.btoa(JSON.stringify(tableData))
    );

    function generateRandomStudentId(dataId: number): string {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let id = '';
      for (let i = 0; i < 8; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
    }
  }

  editScore(updatedData: ScoreTableData): void {
    const fullTableData = this.getFullTableData();
    const index = fullTableData.findIndex((item) => item._id === updatedData._id);

    if (index !== -1) {
      fullTableData[index] = { ...fullTableData[index], ...updatedData };

      localStorage.setItem(
        'score-table-full-data',
        window.btoa(JSON.stringify(fullTableData))
      );
    } else {
      console.error('Item not found for editing.');
    }
  }

  updateCountDocument(scoreData: ScoreTableData[]): ScoreTableData[] {
    return scoreData?.map(score => ({...score, count_documents: scoreData?.length}))
  }

  removeTableDataById(id: number): void {
    const fullTableData = this.getFullTableData();
    const updatedData = fullTableData.filter((item) => item._id !== id);

    const tableData = this.updateCountDocument(updatedData);

    localStorage.setItem(
      'score-table-full-data',
      window.btoa(JSON.stringify(tableData))
    );
  }

  removeTableDataByIds(ids: number[]): void {
    const fullTableData = this.getFullTableData();
    const updatedData = fullTableData.filter((item) => !ids.includes(item._id));

    const tableData = this.updateCountDocument(updatedData);

    localStorage.setItem(
      'score-table-full-data',
      window.btoa(JSON.stringify(tableData))
    );
  }
}

const dummyData = [
  {
      _id: 1,
      student_id: "00000000",
      name: "Student 1",
      course: "History",
      score: "50",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 2,
      student_id: "00000001",
      name: "Student 2",
      course: "Chemistry",
      score: "51",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 3,
      student_id: "00000002",
      name: "Student 3",
      course: "Mathematics",
      score: "52",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 4,
      student_id: "00000003",
      name: "Student 4",
      course: "Psychology",
      score: "53",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 5,
      student_id: "00000004",
      name: "Student 5",
      course: "Computer Science",
      score: "54",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 6,
      student_id: "00000005",
      name: "Student 6",
      course: "Economics",
      score: "55",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 7,
      student_id: "00000006",
      name: "Student 7",
      course: "Geography",
      score: "56",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 8,
      student_id: "00000007",
      name: "Student 8",
      course: "Literature",
      score: "57",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 9,
      student_id: "00000008",
      name: "Student 9",
      course: "Biology",
      score: "58",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 10,
      student_id: "00000009",
      name: "Student 10",
      course: "Physics",
      score: "59",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 11,
      student_id: "0000000a",
      name: "Student 11",
      course: "History",
      score: "60",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 12,
      student_id: "0000000b",
      name: "Student 12",
      course: "Chemistry",
      score: "61",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 13,
      student_id: "0000000c",
      name: "Student 13",
      course: "Mathematics",
      score: "62",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 14,
      student_id: "0000000d",
      name: "Student 14",
      course: "Psychology",
      score: "63",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 15,
      student_id: "0000000e",
      name: "Student 15",
      course: "Computer Science",
      score: "64",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 16,
      student_id: "0000000f",
      name: "Student 16",
      course: "Economics",
      score: "65",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 17,
      student_id: "00000010",
      name: "Student 17",
      course: "Geography",
      score: "66",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 18,
      student_id: "00000011",
      name: "Student 18",
      course: "Literature",
      score: "67",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 19,
      student_id: "00000012",
      name: "Student 19",
      course: "Biology",
      score: "68",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 20,
      student_id: "00000013",
      name: "Student 20",
      course: "Physics",
      score: "69",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 21,
      student_id: "00000014",
      name: "Student 21",
      course: "History",
      score: "70",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 22,
      student_id: "00000015",
      name: "Student 22",
      course: "Chemistry",
      score: "71",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 23,
      student_id: "00000016",
      name: "Student 23",
      course: "Mathematics",
      score: "72",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 24,
      student_id: "00000017",
      name: "Student 24",
      course: "Psychology",
      score: "73",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 25,
      student_id: "00000018",
      name: "Student 25",
      course: "Computer Science",
      score: "74",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 26,
      student_id: "00000019",
      name: "Student 26",
      course: "Economics",
      score: "75",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 27,
      student_id: "0000001a",
      name: "Student 27",
      course: "Geography",
      score: "76",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 28,
      student_id: "0000001b",
      name: "Student 28",
      course: "Literature",
      score: "77",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 29,
      student_id: "0000001c",
      name: "Student 29",
      course: "Biology",
      score: "78",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 30,
      student_id: "0000001d",
      name: "Student 30",
      course: "Physics",
      score: "79",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 31,
      student_id: "0000001e",
      name: "Student 31",
      course: "History",
      score: "80",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 32,
      student_id: "0000001f",
      name: "Student 32",
      course: "Chemistry",
      score: "81",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 33,
      student_id: "00000020",
      name: "Student 33",
      course: "Mathematics",
      score: "82",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 34,
      student_id: "00000021",
      name: "Student 34",
      course: "Psychology",
      score: "83",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 35,
      student_id: "00000022",
      name: "Student 35",
      course: "Computer Science",
      score: "84",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 36,
      student_id: "00000023",
      name: "Student 36",
      course: "Economics",
      score: "85",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 37,
      student_id: "00000024",
      name: "Student 37",
      course: "Geography",
      score: "86",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 38,
      student_id: "00000025",
      name: "Student 38",
      course: "Literature",
      score: "87",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 39,
      student_id: "00000026",
      name: "Student 39",
      course: "Biology",
      score: "88",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 40,
      student_id: "00000027",
      name: "Student 40",
      course: "Physics",
      score: "89",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 41,
      student_id: "00000028",
      name: "Student 41",
      course: "History",
      score: "90",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 42,
      student_id: "00000029",
      name: "Student 42",
      course: "Chemistry",
      score: "91",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 43,
      student_id: "0000002a",
      name: "Student 43",
      course: "Mathematics",
      score: "92",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 44,
      student_id: "0000002b",
      name: "Student 44",
      course: "Psychology",
      score: "93",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 45,
      student_id: "0000002c",
      name: "Student 45",
      course: "Computer Science",
      score: "94",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 46,
      student_id: "0000002d",
      name: "Student 46",
      course: "Economics",
      score: "95",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 47,
      student_id: "0000002e",
      name: "Student 47",
      course: "Geography",
      score: "96",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 48,
      student_id: "0000002f",
      name: "Student 48",
      course: "Literature",
      score: "97",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 49,
      student_id: "00000030",
      name: "Student 49",
      course: "Biology",
      score: "98",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 50,
      student_id: "00000031",
      name: "Student 50",
      course: "Physics",
      score: "99",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 51,
      student_id: "00000032",
      name: "Student 51",
      course: "History",
      score: "50",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 52,
      student_id: "00000033",
      name: "Student 52",
      course: "Chemistry",
      score: "51",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 53,
      student_id: "00000034",
      name: "Student 53",
      course: "Mathematics",
      score: "52",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 54,
      student_id: "00000035",
      name: "Student 54",
      course: "Psychology",
      score: "53",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 55,
      student_id: "00000036",
      name: "Student 55",
      course: "Computer Science",
      score: "54",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 56,
      student_id: "00000037",
      name: "Student 56",
      course: "Economics",
      score: "55",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 57,
      student_id: "00000038",
      name: "Student 57",
      course: "Geography",
      score: "56",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 58,
      student_id: "00000039",
      name: "Student 58",
      course: "Literature",
      score: "57",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 59,
      student_id: "0000003a",
      name: "Student 59",
      course: "Biology",
      score: "58",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 60,
      student_id: "0000003b",
      name: "Student 60",
      course: "Physics",
      score: "59",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 61,
      student_id: "0000003c",
      name: "Student 61",
      course: "History",
      score: "60",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 62,
      student_id: "0000003d",
      name: "Student 62",
      course: "Chemistry",
      score: "61",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 63,
      student_id: "0000003e",
      name: "Student 63",
      course: "Mathematics",
      score: "62",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 64,
      student_id: "0000003f",
      name: "Student 64",
      course: "Psychology",
      score: "63",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 65,
      student_id: "00000040",
      name: "Student 65",
      course: "Computer Science",
      score: "64",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 66,
      student_id: "00000041",
      name: "Student 66",
      course: "Economics",
      score: "65",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 67,
      student_id: "00000042",
      name: "Student 67",
      course: "Geography",
      score: "66",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 68,
      student_id: "00000043",
      name: "Student 68",
      course: "Literature",
      score: "67",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 69,
      student_id: "00000044",
      name: "Student 69",
      course: "Biology",
      score: "68",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 70,
      student_id: "00000045",
      name: "Student 70",
      course: "Physics",
      score: "69",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 71,
      student_id: "00000046",
      name: "Student 71",
      course: "History",
      score: "70",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 72,
      student_id: "00000047",
      name: "Student 72",
      course: "Chemistry",
      score: "71",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 73,
      student_id: "00000048",
      name: "Student 73",
      course: "Mathematics",
      score: "72",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 74,
      student_id: "00000049",
      name: "Student 74",
      course: "Psychology",
      score: "73",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 75,
      student_id: "0000004a",
      name: "Student 75",
      course: "Computer Science",
      score: "74",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 76,
      student_id: "0000004b",
      name: "Student 76",
      course: "Economics",
      score: "75",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 77,
      student_id: "0000004c",
      name: "Student 77",
      course: "Geography",
      score: "76",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 78,
      student_id: "0000004d",
      name: "Student 78",
      course: "Literature",
      score: "77",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 79,
      student_id: "0000004e",
      name: "Student 79",
      course: "Biology",
      score: "78",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 80,
      student_id: "0000004f",
      name: "Student 80",
      course: "Physics",
      score: "79",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 81,
      student_id: "00000050",
      name: "Student 81",
      course: "History",
      score: "80",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 82,
      student_id: "00000051",
      name: "Student 82",
      course: "Chemistry",
      score: "81",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 83,
      student_id: "00000052",
      name: "Student 83",
      course: "Mathematics",
      score: "82",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 84,
      student_id: "00000053",
      name: "Student 84",
      course: "Psychology",
      score: "83",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 85,
      student_id: "00000054",
      name: "Student 85",
      course: "Computer Science",
      score: "84",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 86,
      student_id: "00000055",
      name: "Student 86",
      course: "Economics",
      score: "85",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 87,
      student_id: "00000056",
      name: "Student 87",
      course: "Geography",
      score: "86",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 88,
      student_id: "00000057",
      name: "Student 88",
      course: "Literature",
      score: "87",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 89,
      student_id: "00000058",
      name: "Student 89",
      course: "Biology",
      score: "88",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 90,
      student_id: "00000059",
      name: "Student 90",
      course: "Physics",
      score: "89",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 91,
      student_id: "0000005a",
      name: "Student 91",
      course: "History",
      score: "90",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 92,
      student_id: "0000005b",
      name: "Student 92",
      course: "Chemistry",
      score: "91",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 93,
      student_id: "0000005c",
      name: "Student 93",
      course: "Mathematics",
      score: "92",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 94,
      student_id: "0000005d",
      name: "Student 94",
      course: "Psychology",
      score: "93",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 95,
      student_id: "0000005e",
      name: "Student 95",
      course: "Computer Science",
      score: "94",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 96,
      student_id: "0000005f",
      name: "Student 96",
      course: "Economics",
      score: "95",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 97,
      student_id: "00000060",
      name: "Student 97",
      course: "Geography",
      score: "96",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 98,
      student_id: "00000061",
      name: "Student 98",
      course: "Literature",
      score: "97",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 99,
      student_id: "00000062",
      name: "Student 99",
      course: "Biology",
      score: "98",
      class: "3D",
      count_documents: 100
  },
  {
      _id: 100,
      student_id: "00000063",
      name: "Student 100",
      course: "Physics",
      score: "99",
      class: "3D",
      count_documents: 100
  }
];
