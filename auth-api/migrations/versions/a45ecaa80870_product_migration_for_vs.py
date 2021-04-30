"""product_migration_for_vs

Revision ID: a45ecaa80870
Revises: d0392ebda924
Create Date: 2021-04-28 15:04:17.693702

"""

from alembic import op
from flask import current_app

from auth_api.models import db
from auth_api.services.products import Product
from auth_api.services.rest_service import RestService

# revision identifiers, used by Alembic.
revision = 'a45ecaa80870'
down_revision = 'd0392ebda924'
branch_labels = None
depends_on = None


def upgrade():
    # Query all orgs which are linked to BCOL.
    conn = op.get_bind()
    org_res = conn.execute(
        "select o.id, o.bcol_user_id from orgs o where bcol_user_id is not null and bcol_account_id is not null;"
    )
    orgs = org_res.fetchall()
    print('starting migration for BCOL products')
    if len(orgs) > 0:
        token = RestService.get_service_account_token()
    for org_id in orgs:
        try:
            print('Getting bcol profile for ', org_id[0], org_id[1])
            bcol_response = RestService.get(endpoint=current_app.config.get('BCOL_API_URL') + f'/profiles/{org_id[1]}',
                                            token=token)
            print('BCOL Response', bcol_response.json())
            Product.create_subscription_from_bcol_profile(org_id[0], bcol_response.json().get('profileFlags'))
        except Exception as exc:
            print('Profile Error')
            print(exc)
    db.session.commit()


def downgrade():
    pass
