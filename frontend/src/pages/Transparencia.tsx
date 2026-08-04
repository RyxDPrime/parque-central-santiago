import { PageHero } from '../components/PageHero'
import { EmptyState, LoadingState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { api } from '../api/client'

const fechaFormatter = new Intl.DateTimeFormat('es-DO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

export function Transparencia() {
  const { data, loading } = useApiData(api.getDocumentosFinancieros)

  const auditados = data?.filter((d) => d.tipo === 'auditado') ?? []
  const sinAuditar = data?.filter((d) => d.tipo === 'sin_auditar') ?? []

  return (
    <>
      <PageHero
        label="Institución"
        title="Transparencia"
        description="Quiénes somos y el marco bajo el que opera el Parque Central de Santiago."
        image="/images/galeria/entrada-parque.jpg"
      />

      <section className="section">
        <div className="section-inner">
          <div className="transparency-intro">
            <div className="transparency-intro-icon">
              <i className="ti ti-building-bank" />
            </div>
            <div>
              <h3>Quiénes somos</h3>
              <p>
                El Parque Central de Santiago es administrado por el Patronato para la
                Administración del Parque Central de Santiago, una entidad sin fines de lucro
                constituida el 6 de abril de 2018, resultado del esfuerzo conjunto entre la
                Asociación para el Desarrollo, Inc. (APEDI) y diecisiete instituciones públicas y
                privadas de la región. Está registrado bajo la Ley 122-05 del 8 de abril de 2005.
                RNC: 430-25261-1.
              </p>
            </div>
          </div>

          <div className="transparency-grid">
            <div className="transparency-block">
              <h3>
                <i className="ti ti-file-invoice" /> Estados Financieros Auditados
              </h3>
              {loading && <LoadingState />}
              {!loading && auditados.length === 0 && (
                <EmptyState
                  icon="ti-file-invoice"
                  title="Sin documentos por ahora"
                  description="Los estados financieros auditados del Patronato se publicarán en cuanto estén disponibles."
                />
              )}
              {auditados.map((doc) => (
                <a key={doc.id} href={doc.url} target="_blank" rel="noopener" className="document-card">
                  <i className="ti ti-file-type-pdf" />
                  <div>
                    <h4>{doc.titulo}</h4>
                    {doc.fecha && <span>{fechaFormatter.format(new Date(doc.fecha))}</span>}
                  </div>
                  <i className="ti ti-download document-card-download" />
                </a>
              ))}
            </div>

            <div className="transparency-block">
              <h3>
                <i className="ti ti-report-money" /> Estados Financieros Sin Auditar
              </h3>
              {loading && <LoadingState />}
              {!loading && sinAuditar.length === 0 && (
                <EmptyState
                  icon="ti-report-money"
                  title="Sin documentos por ahora"
                  description="Los estados financieros sin auditar del Patronato se publicarán en cuanto estén disponibles."
                />
              )}
              {sinAuditar.map((doc) => (
                <a key={doc.id} href={doc.url} target="_blank" rel="noopener" className="document-card">
                  <i className="ti ti-file-type-pdf" />
                  <div>
                    <h4>{doc.titulo}</h4>
                    {doc.fecha && <span>{fechaFormatter.format(new Date(doc.fecha))}</span>}
                  </div>
                  <i className="ti ti-download document-card-download" />
                </a>
              ))}
            </div>
          </div>

          <div className="facility-icon-grid" style={{ marginTop: 20 }}>
            <div className="facility-icon-card">
              <div className="facility-icon-badge">
                <i className="ti ti-scale" />
              </div>
              <div>
                <div className="facility-icon-head">
                  <h3>Marco normativo</h3>
                </div>
                <p>Ley 122-05 del 8 de abril de 2005, que regula las asociaciones sin fines de lucro en la República Dominicana.</p>
              </div>
            </div>
            <div className="facility-icon-card">
              <div className="facility-icon-badge">
                <i className="ti ti-heart-handshake" />
              </div>
              <div>
                <div className="facility-icon-head">
                  <h3>Uso de donaciones</h3>
                </div>
                <p>El detalle sobre el uso de las donaciones recibidas se publicará en una fase posterior del proyecto.</p>
              </div>
            </div>
            <div className="facility-icon-card">
              <div className="facility-icon-badge">
                <i className="ti ti-file-certificate" />
              </div>
              <div>
                <div className="facility-icon-head">
                  <h3>Código de ética</h3>
                </div>
                <p>El código de ética institucional se publicará en cuanto el Parque lo confirme.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
