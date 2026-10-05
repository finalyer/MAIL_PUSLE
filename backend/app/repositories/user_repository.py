from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.user import User
from app.schemas.user import UserCreate
import datetime


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id) -> User | None:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_google_id(self, google_user_id: str) -> User | None:
        return self.db.query(User).filter(User.google_user_id == google_user_id).first()

    def get_by_email(self, email: str) -> User | None:
        return self.db.query(User).filter(User.email == email).first()

    def create(self, data: UserCreate) -> User:
        user = User(**data.model_dump())
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update_last_login(self, user: User) -> User:
        user.last_login_at = datetime.datetime.utcnow()
        self.db.commit()
        self.db.refresh(user)
        return user

    def upsert(self, google_user_id: str, email: str, name: str, picture: str) -> User:
        user = self.get_by_google_id(google_user_id)
        if user:
            user.email = email
            user.name = name
            user.profile_picture = picture
            user.last_login_at = datetime.datetime.utcnow()
            self.db.commit()
            self.db.refresh(user)
        else:
            user = User(
                google_user_id=google_user_id,
                email=email,
                name=name,
                profile_picture=picture,
                last_login_at=datetime.datetime.utcnow(),
            )
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
        return user
