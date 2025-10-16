from ninja import Router, Schema
from typing import List, Optional
from django.shortcuts import get_object_or_404
from .models import Student
from datetime import datetime


router = Router()

class StudentIn(Schema):
    first_name: str
    last_name: str
    email: str
    is_active: Optional[bool] = True

# Pour PATCH: tous les champs optionnels
class StudentUpdate(Schema):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    is_active: Optional[bool] = None

class StudentOut(Schema):
    id: int
    first_name: str
    last_name: str
    email: str
    is_active: bool
    created_at: datetime   # <-- au lieu de str


@router.get("/", response=List[StudentOut])
def list_students(request, limit: int = 100, offset: int = 0):
    return list(Student.objects.all()[offset:offset+limit])

@router.post("/", response=StudentOut)
def create_student(request, payload: StudentIn):
    student = Student.objects.create(**payload.dict())
    return student

@router.get("/{student_id}", response=StudentOut)
def get_student(request, student_id: int):
    return get_object_or_404(Student, id=student_id)

@router.put("/{student_id}", response=StudentOut)
def update_student(request, student_id: int, payload: StudentIn):
    student = get_object_or_404(Student, id=student_id)
    for field, value in payload.dict().items():
        setattr(student, field, value)
    student.save()
    return student

@router.patch("/{student_id}", response=StudentOut)
def partial_update_student(request, student_id: int, payload: StudentUpdate):
    student = get_object_or_404(Student, id=student_id)
    for field, value in payload.dict(exclude_unset=True).items():
        setattr(student, field, value)
    student.save()
    return student

@router.delete("/{student_id}")
def delete_student(request, student_id: int):
    get_object_or_404(Student, id=student_id).delete()
    return {"success": True}
