import Spinner from 'react-bootstrap/Spinner';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
const LoaderSpinner = ({ t }) => (
  <Spinner animation="border" variant="warning" role="status">
    <span className="sr-only">{t('loading')}</span>
  </Spinner>
)

export default compose(withTranslation())(LoaderSpinner);