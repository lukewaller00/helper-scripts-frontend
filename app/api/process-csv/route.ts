import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {

    try {
        //Assign req body
        const { csvData, startDate, endDate } = await req.json();

        // Validate Input
        if (!csvData || !startDate || !endDate) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Further Validation of Dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
        }

        //Generate list of dates 
        const attendanceDates: string[] = [];
        let currentDate = new Date(start);
        
        while (currentDate <= end) {
            attendanceDates.push(currentDate.toISOString().split("T")[0]); // Format as YYYY-MM-DD
            currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1)); // Create a new date with incremented day
            }
        
        console.log("Valid Attendance Dates List: ", attendanceDates)
        
        // Parse the CSV data
        const marks = csvData.split(",").map((mark: string) => mark.trim());
        console.log("Parsed marks:", marks);

        // Match marks to valid dates
        const days = attendanceDates.map((date, index) => ({
            date,
            am: marks[index * 2] || "", // Get the AM mark for the current day
            pm: marks[index * 2 + 1] || "" // Get the PM mark for the current day
        }));
    
        console.log("Final days array:", days);
        return NextResponse.json({ days });
    
    } catch (error) {
    
        console.error("Error processing CSV data:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    
    }
}