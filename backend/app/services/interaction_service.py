from sqlalchemy.orm import Session
from app.models import Interaction, HCP, FollowUp, User
from app.schemas.schemas import InteractionCreate, InteractionUpdate
from datetime import datetime

class InteractionService:
    @staticmethod
    def create_interaction(db: Session, interaction: InteractionCreate, user_id: int) -> Interaction:
        # Get or create HCP
        hcp = None
        if interaction.hcp_id:
            hcp = db.query(HCP).filter(HCP.id == interaction.hcp_id).first()
        elif interaction.hcp_name:
            hcp = db.query(HCP).filter(HCP.name == interaction.hcp_name).first()
            if not hcp:
                hcp = HCP(name=interaction.hcp_name)
                db.add(hcp)
                db.flush()
        
        if not hcp:
            raise ValueError("HCP not found or invalid")
        
        db_interaction = Interaction(
            user_id=user_id,
            hcp_id=hcp.id,
            interaction_type=interaction.interaction_type,
            date=interaction.date,
            time=interaction.time,
            attendees=interaction.attendees,
            topics_discussed=interaction.topics_discussed,
            materials_shared=interaction.materials_shared,
            samples_distributed=interaction.samples_distributed,
            sentiment=interaction.sentiment,
            outcomes=interaction.outcomes,
            summary=interaction.summary,
        )
        db.add(db_interaction)
        db.commit()
        db.refresh(db_interaction)
        return db_interaction
    
    @staticmethod
    def get_interaction(db: Session, interaction_id: int) -> Interaction:
        return db.query(Interaction).filter(Interaction.id == interaction_id).first()
    
    @staticmethod
    def get_interactions(db: Session, user_id: int, skip: int = 0, limit: int = 20):
        query = db.query(Interaction).filter(Interaction.user_id == user_id)
        total = query.count()
        interactions = query.offset(skip).limit(limit).all()
        return interactions, total
    
    @staticmethod
    def update_interaction(db: Session, interaction_id: int, interaction: InteractionUpdate) -> Interaction:
        db_interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
        if not db_interaction:
            return None
        
        update_data = interaction.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_interaction, field, value)
        
        db.add(db_interaction)
        db.commit()
        db.refresh(db_interaction)
        return db_interaction
    
    @staticmethod
    def delete_interaction(db: Session, interaction_id: int) -> bool:
        db_interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
        if not db_interaction:
            return False
        
        db.delete(db_interaction)
        db.commit()
        return True

class HCPService:
    @staticmethod
    def search_hcp(db: Session, query: str, limit: int = 10):
        return db.query(HCP).filter(
            (HCP.name.ilike(f"%{query}%")) | (HCP.organization.ilike(f"%{query}%"))
        ).limit(limit).all()
    
    @staticmethod
    def get_or_create_hcp(db: Session, name: str, **kwargs) -> HCP:
        hcp = db.query(HCP).filter(HCP.name == name).first()
        if not hcp:
            hcp = HCP(name=name, **kwargs)
            db.add(hcp)
            db.commit()
            db.refresh(hcp)
        return hcp
