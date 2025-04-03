import { NextResponse } from "next/server";

// Temporary in-memory storage
let skills = [];

export async function GET(req, { params }) {
  if (params && params.id) {
    // Handle GET for a single skill by ID
    const { id } = params;
    const skill = skills.find((skill) => skill.id === parseInt(id));

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json(skill, { status: 200 });
  } else {
    // Handle GET for all skills
    console.log("GET /api/skills called");
    console.log("Current skills:", skills);

    return NextResponse.json(skills, { status: 200 });
  }
}

export async function POST(req) {
  const body = await req.json();

  const newSkill = {
    id: Date.now(),
    ...body,
  };

  skills.push(newSkill);

  return NextResponse.json(
    { message: "Skill added successfully", skill: newSkill },
    { status: 201 }
  );
}