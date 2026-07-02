import ProtectedRoute from './ProtectedRoute';

const RoleProtectedRoute = ({ roles }: { roles: string[] }) => (
  <ProtectedRoute roles={roles} />
);

export default RoleProtectedRoute;
