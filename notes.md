def get_movies():
    path = pathlib.Path(__file__).resolve().parent / "movies.json"
    with open(path, 'r') as file:
        data = file.read()
        movies_json = json.loads(data)
    return jsonify(movies_json)

# class Base(DeclarativeBase):
#     pass

# class UserModel(Base):
#     __tablename__ = "users"

#     id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
#     name: Mapped[str]
#     age: Mapped[int]

# # ---------------- SERVICE LAYER (DTO) ----------------

# @dataclass
# class UserDTO:
#     name: str
#     age: int
#     id: Optional[int] = None


# def create_user(dto: UserDTO, db: Session) -> UserDTO:
#     model = UserModel(name=dto.name, age=dto.age)

#     db.add(model)
#     db.commit()
#     db.refresh(model)

#     return UserDTO(id=model.id, name=model.name, age=model.age)


# # ---------------- API LAYER ----------------

# class UserCreateRequest(BaseModel):
#     name: str
#     age: int


# class UserResponse(BaseModel):
#     id: int
#     name: str
#     age: int

# @app.post("/users", response_model=UserResponse)
# def create_user_api(req: UserCreateRequest, db: Session = Depends(get_db)):
#     # API → DTO
#     dto = UserDTO(name=req.name, age=req.age)

#     # service
#     result = create_user(dto, db)

#     # DTO → response
#     return UserResponse(**result.__dict__)